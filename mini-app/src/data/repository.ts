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

export type AppRepository = {
  ensureProfile(user: TelegramUser): Promise<Profile>;
  getMembership(studentId: string): Promise<Membership | null>;
  listUpcomingTrainings(): Promise<Training[]>;
  listMyBookings(studentId: string): Promise<BookingWithTraining[]>;
  book(studentId: string, trainingId: string): Promise<Booking>;
  cancel(studentId: string, bookingId: string): Promise<void>;
  listStudents(): Promise<Array<Profile & { membership: Membership | null }>>;
  createTraining(input: CreateTrainingInput): Promise<Training>;
  listBookingsForTraining(trainingId: string): Promise<BookingWithStudent[]>;
  markAttendance(
    bookingId: string,
    status: "attended" | "missed",
  ): Promise<void>;
  updateRemainingSessions(
    studentId: string,
    remainingSessions: number,
  ): Promise<Membership>;
};
