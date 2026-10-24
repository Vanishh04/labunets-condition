import { useEffect, useState } from "react";
import { useReadySession, useTick } from "@/app/SessionContext";
import { formatTrainingWhen } from "@/shared/lib/dates";
import { hapticError, hapticSuccess } from "@/shared/lib/telegram";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Page } from "@/shared/ui/Page";
import { AppError, type BookingWithTraining, type Training } from "@/types/domain";

const typeLabel = {
  ofp: "ОФП",
  sfp: "СФП",
  stretch: "растяжка",
};

export function SchedulePage() {
  const { profile, repo } = useReadySession();
  const { tick, refresh } = useTick();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [bookings, setBookings] = useState<BookingWithTraining[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      repo.listUpcomingTrainings(),
      repo.listMyBookings(profile.id),
    ]).then(([nextTrainings, nextBookings]) => {
      setTrainings(nextTrainings);
      setBookings(nextBookings);
    });
  }, [profile.id, repo, tick]);

  const bookingByTraining = new Map(
    bookings
      .filter((booking) => booking.status === "booked")
      .map((booking) => [booking.trainingId, booking]),
  );

  async function handleBook(trainingId: string) {
    setBusyId(trainingId);
    setMessage(null);
    try {
      await repo.book(profile.id, trainingId);
      hapticSuccess();
      setMessage("Вы записаны на тренировку");
      refresh();
    } catch (error) {
      hapticError();
      setMessage(error instanceof AppError ? error.message : "Не получилось записаться");
    } finally {
      setBusyId(null);
    }
  }

  async function handleCancel(bookingId: string, trainingId: string) {
    setBusyId(trainingId);
    setMessage(null);
    try {
      await repo.cancel(profile.id, bookingId);
      hapticSuccess();
      setMessage("Запись отменена");
      refresh();
    } catch (error) {
      hapticError();
      setMessage(error instanceof AppError ? error.message : "Не получилось отменить");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Page title="Расписание" subtitle="Запишитесь или отмените тренировку">
      {message ? <p className="toast">{message}</p> : null}
      {trainings.map((training) => {
        const booking = bookingByTraining.get(training.id);
        return (
          <Card key={training.id}>
            <span className="chip">{typeLabel[training.type]}</span>
            <h3>{training.title}</h3>
            <p className="muted">
              {formatTrainingWhen(training.startsAt)} · {training.durationMin} мин
            </p>
            <p className="muted">{training.location}</p>
            {booking ? (
              <Button
                variant="ghost"
                disabled={busyId === training.id}
                onClick={() => void handleCancel(booking.id, training.id)}
              >
                Отменить запись
              </Button>
            ) : (
              <Button
                disabled={busyId === training.id}
                onClick={() => void handleBook(training.id)}
              >
                Записаться
              </Button>
            )}
          </Card>
        );
      })}
    </Page>
  );
}
