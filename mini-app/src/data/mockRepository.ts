import {
  mockBookings,
  mockMemberships,
  mockPastTrainings,
  mockProfiles,
  mockTrainings,
} from "@/data/mock";
import type { AppRepository } from "@/data/repository";
import { isAdminTelegramId } from "@/shared/lib/env";
import { AppError } from "@/types/domain";
import type {
  Booking,
  BookingWithStudent,
  BookingWithTraining,
  CreateTrainingInput,
  Membership,
  Profile,
  Training,
} from "@/types/domain";
import type { TelegramUser } from "@/types/telegram";

function clone<T>(value: T): T {
  return structuredClone(value);
}

function nextId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function displayName(user: TelegramUser): Pick<Profile, "firstName" | "lastName"> {
  return {
    firstName: user.first_name,
    lastName: user.last_name ?? null,
  };
}

export function createMockRepository(): AppRepository {
  const profiles = clone(mockProfiles);
  const memberships = clone(mockMemberships);
  const trainings = [...clone(mockTrainings), ...clone(mockPastTrainings)];
  const bookings = clone(mockBookings);

  const findProfile = (studentId: string) =>
    profiles.find((profile) => profile.id === studentId);

  const findTraining = (trainingId: string) =>
    trainings.find((training) => training.id === trainingId);

  const activeBookedCount = (trainingId: string) =>
    bookings.filter(
      (booking) => booking.trainingId === trainingId && booking.status === "booked",
    ).length;

  return {
    async ensureProfile(user) {
      const existing = profiles.find((profile) => profile.telegramId === user.id);
      if (existing) {
        Object.assign(existing, displayName(user), {
          username: user.username ?? existing.username,
          role: isAdminTelegramId(user.id) ? "admin" : existing.role,
        });
        return clone(existing);
      }

      const profile: Profile = {
        id: nextId("p"),
        telegramId: user.id,
        ...displayName(user),
        username: user.username ?? null,
        role: isAdminTelegramId(user.id) ? "admin" : "student",
      };
      profiles.push(profile);
      return clone(profile);
    },

    async getMembership(studentId) {
      const membership = memberships.find(
        (item) => item.studentId === studentId && item.isActive,
      );
      return membership ? clone(membership) : null;
    },

    async listUpcomingTrainings() {
      const now = Date.now();
      return clone(
        trainings
          .filter((training) => new Date(training.startsAt).getTime() >= now)
          .sort(
            (a, b) =>
              new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
          ),
      );
    },

    async listMyBookings(studentId) {
      const items: BookingWithTraining[] = bookings
        .filter((booking) => booking.studentId === studentId)
        .map((booking) => {
          const training = findTraining(booking.trainingId);
          if (!training) return null;
          return { ...clone(booking), training: clone(training) };
        })
        .filter((item): item is BookingWithTraining => item !== null)
        .sort(
          (a, b) =>
            new Date(b.training.startsAt).getTime() -
            new Date(a.training.startsAt).getTime(),
        );
      return items;
    },

    async book(studentId, trainingId) {
      const training = findTraining(trainingId);
      if (!training) throw new AppError("NOT_FOUND", "Тренировка не найдена");

      const already = bookings.some(
        (booking) =>
          booking.studentId === studentId &&
          booking.trainingId === trainingId &&
          booking.status === "booked",
      );
      if (already) throw new AppError("ALREADY_BOOKED", "Вы уже записаны");

      if (activeBookedCount(trainingId) >= training.capacity) {
        throw new AppError("FULL", "Мест больше нет");
      }

      const membership = memberships.find(
        (item) => item.studentId === studentId && item.isActive,
      );
      if (!membership || membership.remainingSessions <= 0) {
        throw new AppError("NO_SESSIONS", "Нет тренировок в абонементе");
      }

      const booking: Booking = {
        id: nextId("b"),
        studentId,
        trainingId,
        status: "booked",
        createdAt: new Date().toISOString(),
      };
      bookings.push(booking);
      return clone(booking);
    },

    async cancel(studentId, bookingId) {
      const booking = bookings.find((item) => item.id === bookingId);
      if (!booking || booking.studentId !== studentId) {
        throw new AppError("NOT_FOUND", "Запись не найдена");
      }
      booking.status = "cancelled";
    },

    async listStudents() {
      return profiles
        .filter((profile) => profile.role === "student")
        .map((profile) => {
          const membership =
            memberships.find((item) => item.studentId === profile.id && item.isActive) ??
            memberships.find((item) => item.studentId === profile.id) ??
            null;
          return { ...clone(profile), membership: membership ? clone(membership) : null };
        });
    },

    async createTraining(input: CreateTrainingInput) {
      const training: Training = { id: nextId("t"), ...input };
      trainings.push(training);
      return clone(training);
    },

    async listBookingsForTraining(trainingId) {
      const items: BookingWithStudent[] = bookings
        .filter(
          (booking) =>
            booking.trainingId === trainingId && booking.status !== "cancelled",
        )
        .map((booking) => {
          const student = findProfile(booking.studentId);
          if (!student) return null;
          return { ...clone(booking), student: clone(student) };
        })
        .filter((item): item is BookingWithStudent => item !== null);
      return items;
    },

    async markAttendance(bookingId, status) {
      const booking = bookings.find((item) => item.id === bookingId);
      if (!booking) throw new AppError("NOT_FOUND", "Запись не найдена");

      const wasAttended = booking.status === "attended";
      booking.status = status;

      if (status === "attended" && !wasAttended) {
        const membership = memberships.find(
          (item) => item.studentId === booking.studentId && item.isActive,
        );
        if (membership && membership.remainingSessions > 0) {
          membership.remainingSessions -= 1;
        }
      }
    },

    async updateRemainingSessions(studentId, remainingSessions) {
      let membership = memberships.find(
        (item) => item.studentId === studentId && item.isActive,
      );

      if (!membership) {
        membership = {
          id: nextId("m"),
          studentId,
          title: "Абонемент",
          remainingSessions,
          startsAt: new Date().toISOString(),
          endsAt: null,
          isActive: true,
        };
        memberships.push(membership);
      } else {
        membership.remainingSessions = Math.max(0, remainingSessions);
        membership.isActive = membership.remainingSessions > 0;
      }

      return clone(membership);
    },
  };
}
