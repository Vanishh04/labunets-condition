function parseAdminIds(raw: string | undefined): number[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value) && value > 0);
}

export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
  adminTelegramIds: parseAdminIds(import.meta.env.VITE_ADMIN_TELEGRAM_IDS),
  useDevMockUser: import.meta.env.VITE_DEV_MOCK_USER === "1",
};

export function isAdminTelegramId(telegramId: number): boolean {
  return env.adminTelegramIds.includes(telegramId);
}
