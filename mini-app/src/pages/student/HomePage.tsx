import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useReadySession } from "@/app/SessionContext";
import { formatTrainingWhen } from "@/shared/lib/dates";
import { Card } from "@/shared/ui/Card";
import { Page } from "@/shared/ui/Page";
import type { BookingWithTraining, Membership } from "@/types/domain";

export function HomePage() {
  const { profile, repo } = useReadySession();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [nextBooking, setNextBooking] = useState<BookingWithTraining | null>(null);

  useEffect(() => {
    void Promise.all([
      repo.getMembership(profile.id),
      repo.listMyBookings(profile.id),
    ]).then(([nextMembership, bookings]) => {
      setMembership(nextMembership);
      const upcoming = bookings
        .filter(
          (booking) =>
            booking.status === "booked" &&
            new Date(booking.training.startsAt).getTime() >= Date.now(),
        )
        .sort(
          (a, b) =>
            new Date(a.training.startsAt).getTime() -
            new Date(b.training.startsAt).getTime(),
        )[0];
      setNextBooking(upcoming ?? null);
    });
  }, [profile.id, repo]);

  return (
    <Page
      title={`Привет, ${profile.firstName}`}
      subtitle="Профиль ученика и текущий абонемент"
    >
      <Card className="pass-card">
        <p className="kicker">Абонемент</p>
        {membership?.isActive ? (
          <>
            <h2>{membership.title}</h2>
            <p className="pass-count">{membership.remainingSessions}</p>
            <p className="muted">тренировок осталось</p>
          </>
        ) : (
          <>
            <h2>Нет активного абонемента</h2>
            <p className="muted">Администратор может начислить тренировки.</p>
          </>
        )}
      </Card>

      <Card>
        <p className="kicker">Ближайшая запись</p>
        {nextBooking ? (
          <>
            <h3>{nextBooking.training.title}</h3>
            <p className="muted">
              {formatTrainingWhen(nextBooking.training.startsAt)} ·{" "}
              {nextBooking.training.location}
            </p>
          </>
        ) : (
          <p className="muted">Пока нет записи. Выберите тренировку в расписании.</p>
        )}
        <Link className="btn btn-gold" to="/schedule">
          Открыть расписание
        </Link>
      </Card>
    </Page>
  );
}
