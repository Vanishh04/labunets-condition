import { type FormEvent, useEffect, useState } from "react";
import { useReadySession, useTick } from "@/app/SessionContext";
import { formatTrainingWhen, toDatetimeLocalValue } from "@/shared/lib/dates";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Page } from "@/shared/ui/Page";
import type { Training, TrainingType } from "@/types/domain";

export function AdminTrainingsPage() {
  const { repo } = useReadySession();
  const { tick, refresh } = useTick();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [title, setTitle] = useState("ОФП · Condition & Mobility");
  const [type, setType] = useState<TrainingType>("ofp");
  const [startsAt, setStartsAt] = useState(toDatetimeLocalValue());
  const [durationMin, setDurationMin] = useState(60);
  const [capacity, setCapacity] = useState(10);
  const [location, setLocation] = useState("Онлайн · Zoom");

  useEffect(() => {
    void repo.listUpcomingTrainings().then(setTrainings);
  }, [repo, tick]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await repo.createTraining({
      title,
      type,
      startsAt: new Date(startsAt).toISOString(),
      durationMin,
      capacity,
      location,
    });
    refresh();
  }

  return (
    <Page title="Тренировки" subtitle="Создайте занятие в расписании">
      <Card>
        <form className="stack" onSubmit={(event) => void handleSubmit(event)}>
          <label>
            Название
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>
          <label>
            Тип
            <select
              value={type}
              onChange={(event) => setType(event.target.value as TrainingType)}
            >
              <option value="ofp">ОФП</option>
              <option value="sfp">СФП</option>
              <option value="stretch">Растяжка</option>
            </select>
          </label>
          <label>
            Дата и время
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
              required
            />
          </label>
          <div className="form-row">
            <label>
              Минуты
              <input
                type="number"
                min={30}
                value={durationMin}
                onChange={(event) => setDurationMin(Number(event.target.value))}
              />
            </label>
            <label>
              Мест
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={(event) => setCapacity(Number(event.target.value))}
              />
            </label>
          </div>
          <label>
            Место
            <input value={location} onChange={(event) => setLocation(event.target.value)} />
          </label>
          <Button type="submit">Создать тренировку</Button>
        </form>
      </Card>

      {trainings.map((training) => (
        <Card key={training.id}>
          <h3>{training.title}</h3>
          <p className="muted">
            {formatTrainingWhen(training.startsAt)} · {training.capacity} мест
          </p>
        </Card>
      ))}
    </Page>
  );
}
