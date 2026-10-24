const weekdayFormatter = new Intl.DateTimeFormat("ru-RU", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatTrainingWhen(iso: string): string {
  const date = new Date(iso);
  const weekday = weekdayFormatter.format(date).replace(".", "");
  return `${weekday} · ${timeFormatter.format(date)}`;
}

export function toDatetimeLocalValue(date = new Date()): string {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}
