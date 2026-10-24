import type { Booking, Membership, Profile, Training } from "@/types/domain";

function iso(daysFromNow: number, hour: number, minute = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const mockProfiles: Profile[] = [
  {
    id: "p-admin",
    telegramId: 1001,
    firstName: "Иван",
    lastName: "Админ",
    username: "labunets_admin",
    role: "admin",
  },
  {
    id: "p-anna",
    telegramId: 2001,
    firstName: "Анна",
    lastName: "Ученица",
    username: "anna_student",
    role: "student",
  },
  {
    id: "p-mark",
    telegramId: 2002,
    firstName: "Марк",
    lastName: "Коваль",
    username: "mark_k",
    role: "student",
  },
  {
    id: "p-sofia",
    telegramId: 2003,
    firstName: "София",
    lastName: "Лис",
    username: "sofia_lis",
    role: "student",
  },
];

export const mockMemberships: Membership[] = [
  {
    id: "m-anna",
    studentId: "p-anna",
    title: "ОФП + СФП · All-in-One",
    remainingSessions: 8,
    startsAt: iso(-20, 10),
    endsAt: iso(40, 23),
    isActive: true,
  },
  {
    id: "m-mark",
    studentId: "p-mark",
    title: "ОФП · Condition & Mobility",
    remainingSessions: 3,
    startsAt: iso(-10, 10),
    endsAt: iso(20, 23),
    isActive: true,
  },
  {
    id: "m-sofia",
    studentId: "p-sofia",
    title: "СФП · Handstand & Basics",
    remainingSessions: 0,
    startsAt: iso(-30, 10),
    endsAt: iso(-1, 23),
    isActive: false,
  },
];

export const mockTrainings: Training[] = [
  {
    id: "t-1",
    title: "ОФП · Condition & Mobility",
    type: "ofp",
    startsAt: iso(1, 16),
    durationMin: 60,
    capacity: 10,
    location: "Онлайн · Zoom",
  },
  {
    id: "t-2",
    title: "СФП · Handstand & Basics",
    type: "sfp",
    startsAt: iso(2, 18),
    durationMin: 60,
    capacity: 8,
    location: "Онлайн · Zoom",
  },
  {
    id: "t-3",
    title: "ОФП · Condition & Mobility",
    type: "ofp",
    startsAt: iso(4, 16),
    durationMin: 60,
    capacity: 10,
    location: "Онлайн · Zoom",
  },
  {
    id: "t-4",
    title: "Растяжка",
    type: "stretch",
    startsAt: iso(5, 10),
    durationMin: 60,
    capacity: 12,
    location: "Онлайн · Zoom",
  },
];

export const mockBookings: Booking[] = [
  {
    id: "b-1",
    studentId: "p-anna",
    trainingId: "t-1",
    status: "booked",
    createdAt: iso(-1, 12),
  },
  {
    id: "b-2",
    studentId: "p-mark",
    trainingId: "t-1",
    status: "booked",
    createdAt: iso(-1, 13),
  },
  {
    id: "b-3",
    studentId: "p-anna",
    trainingId: "t-past",
    status: "attended",
    createdAt: iso(-8, 12),
  },
  {
    id: "b-4",
    studentId: "p-anna",
    trainingId: "t-past-2",
    status: "cancelled",
    createdAt: iso(-12, 9),
  },
];

export const mockPastTrainings: Training[] = [
  {
    id: "t-past",
    title: "ОФП · Condition & Mobility",
    type: "ofp",
    startsAt: iso(-7, 16),
    durationMin: 60,
    capacity: 10,
    location: "Онлайн · Zoom",
  },
  {
    id: "t-past-2",
    title: "СФП · Handstand & Basics",
    type: "sfp",
    startsAt: iso(-10, 18),
    durationMin: 60,
    capacity: 8,
    location: "Онлайн · Zoom",
  },
];
