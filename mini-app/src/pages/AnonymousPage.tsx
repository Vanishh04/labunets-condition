import { Page } from "@/shared/ui/Page";
import { Card } from "@/shared/ui/Card";

export function AnonymousPage() {
  return (
    <Page
      title="Откройте в Telegram"
      subtitle="Mini App узнаёт ученика через Telegram WebApp"
    >
      <Card>
        <p>
          Локально в браузере включите <code>VITE_DEV_MOCK_USER=1</code> в
          файле <code>.env</code> и перезапустите dev-сервер.
        </p>
        <p className="muted">
          Ученик: <code>/</code>. Админ: <code>/?admin=1</code>.
        </p>
      </Card>
    </Page>
  );
}
