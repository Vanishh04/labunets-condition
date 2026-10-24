import { useEffect, useState } from "react";
import { useReadySession, useTick } from "@/app/SessionContext";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Page } from "@/shared/ui/Page";
import type { Membership, Profile } from "@/types/domain";

type StudentRow = Profile & { membership: Membership | null };

export function AdminStudentsPage() {
  const { repo } = useReadySession();
  const { tick, refresh } = useTick();
  const [students, setStudents] = useState<StudentRow[]>([]);

  useEffect(() => {
    void repo.listStudents().then(setStudents);
  }, [repo, tick]);

  async function changeSessions(student: StudentRow, delta: number) {
    const current = student.membership?.remainingSessions ?? 0;
    await repo.updateRemainingSessions(student.id, current + delta);
    refresh();
  }

  return (
    <Page title="Ученики" subtitle="Абонементы и оставшиеся тренировки">
      {students.map((student) => (
        <Card key={student.id}>
          <h3>
            {student.firstName} {student.lastName ?? ""}
          </h3>
          <p className="muted">
            {student.membership?.title ?? "Без абонемента"} ·{" "}
            {student.username ? `@${student.username}` : `id ${student.telegramId}`}
          </p>
          <div className="counter-row">
            <Button variant="ghost" onClick={() => void changeSessions(student, -1)}>
              −
            </Button>
            <strong>{student.membership?.remainingSessions ?? 0}</strong>
            <Button variant="ghost" onClick={() => void changeSessions(student, 1)}>
              +
            </Button>
          </div>
        </Card>
      ))}
    </Page>
  );
}
