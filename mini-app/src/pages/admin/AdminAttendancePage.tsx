import { useEffect, useState } from "react";
import { useReadySession, useTick } from "@/app/SessionContext";
import { formatTrainingWhen } from "@/shared/lib/dates";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Page } from "@/shared/ui/Page";
import type { BookingWithStudent, Training } from "@/types/domain";

export function AdminAttendancePage() {
  const { repo } = useReadySession();
  const { tick, refresh } = useTick();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [trainingId, setTrainingId] = useState("");
  const [bookings, setBookings] = useState<BookingWithStudent[]>([]);

  useEffect(() => {
    void repo.listUpcomingTrainings().then((items) => {
      setTrainings(items);
      setTrainingId((current) => current || items[0]?.id || "");
    });
  }, [repo, tick]);

  useEffect(() => {
    if (!trainingId) return;
    void repo.listBookingsForTraining(trainingId).then(setBookings);
  }, [repo, trainingId, tick]);

  async function mark(bookingId: string, status: "attended" | "missed") {
    await repo.markAttendance(bookingId, status);
    refresh();
  }

  return (
    <Page title="Посещения" subtitle="Отметьте, кто был на тренировке">
      <Card>
        <label>
          Тренировка
          <select
            value={trainingId}
            onChange={(event) => setTrainingId(event.target.value)}
          >
            {trainings.map((training) => (
              <option key={training.id} value={training.id}>
                {training.title} · {formatTrainingWhen(training.startsAt)}
              </option>
            ))}
          </select>
        </label>
      </Card>

      {bookings.length === 0 ? (
        <Card>
          <p className="muted">На эту тренировку пока никто не записан.</p>
        </Card>
      ) : (
        bookings.map((booking) => (
          <Card key={booking.id}>
            <h3>
              {booking.student.firstName} {booking.student.lastName ?? ""}
            </h3>
            <p className="muted">статус: {booking.status}</p>
            <div className="form-row">
              <Button
                variant="navy"
                onClick={() => void mark(booking.id, "attended")}
              >
                Был
              </Button>
              <Button
                variant="ghost"
                onClick={() => void mark(booking.id, "missed")}
              >
                Пропуск
              </Button>
            </div>
          </Card>
        ))
      )}
    </Page>
  );
}
