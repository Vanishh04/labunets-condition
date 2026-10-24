import { useEffect, useState } from "react";
import { useReadySession } from "@/app/SessionContext";
import { formatTrainingWhen } from "@/shared/lib/dates";
import { Card } from "@/shared/ui/Card";
import { Page } from "@/shared/ui/Page";
import type { BookingStatus, BookingWithTraining } from "@/types/domain";

const statusLabel: Record<BookingStatus, string> = {
  booked: "запись",
  cancelled: "отмена",
  attended: "было",
  missed: "пропуск",
};

export function HistoryPage() {
  const { profile, repo } = useReadySession();
  const [bookings, setBookings] = useState<BookingWithTraining[]>([]);

  useEffect(() => {
    void repo.listMyBookings(profile.id).then(setBookings);
  }, [profile.id, repo]);

  return (
    <Page title="История" subtitle="Все ваши записи и посещения">
      {bookings.length === 0 ? (
        <Card>
          <p className="muted">История пока пустая.</p>
        </Card>
      ) : (
        bookings.map((booking) => (
          <Card key={booking.id}>
            <span className={`chip chip-${booking.status}`}>
              {statusLabel[booking.status]}
            </span>
            <h3>{booking.training.title}</h3>
            <p className="muted">{formatTrainingWhen(booking.training.startsAt)}</p>
          </Card>
        ))
      )}
    </Page>
  );
}
