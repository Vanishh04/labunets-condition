import { env } from "@/shared/lib/env";
import type { TelegramUser } from "@/types/telegram";

export function initTelegram(): void {
  const webApp = window.Telegram?.WebApp;
  if (!webApp) return;

  webApp.ready();
  webApp.expand();

  try {
    webApp.setHeaderColor("#0a192f");
    webApp.setBackgroundColor("#f0f4f8");
  } catch {
    // Older Telegram clients may not support theme helpers.
  }
}

export function getTelegramUser(): TelegramUser | null {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  return user?.id ? user : null;
}

export function getDevMockUser(): TelegramUser | null {
  if (!env.useDevMockUser) return null;

  const params = new URLSearchParams(window.location.search);
  const asAdmin = params.get("admin") === "1";

  return asAdmin
    ? {
        id: 1001,
        first_name: "Иван",
        last_name: "Админ",
        username: "labunets_admin",
      }
    : {
        id: 2001,
        first_name: "Анна",
        last_name: "Ученица",
        username: "anna_student",
      };
}

export function resolveCurrentUser(): TelegramUser | null {
  return getTelegramUser() ?? getDevMockUser();
}

export function hapticSuccess(): void {
  window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success");
}

export function hapticError(): void {
  window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("error");
}
