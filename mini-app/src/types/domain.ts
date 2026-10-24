export type UserRole = "student" | "admin";

export type TrainingType = "ofp" | "sfp" | "stretch";

export type BookingStatus = "booked" | "cancelled" | "attended" | "missed";

export type Profile = {
  id: string;
  telegramId: number;
  firstName: string;
  lastName: string | null;
  username: string | null;
  role: UserRole;
};

export type Membership = {
  id: string;
  studentId: string;
  title: string;
  remainingSessions: number;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
};

export type Training = {
  id: string;
  title: string;
  type: TrainingType;
  startsAt: string;
  durationMin: number;
  capacity: number;
  location: string;
};

export type Booking = {
  id: string;
  studentId: string;
  trainingId: string;
  status: BookingStatus;
  createdAt: string;
};

export type BookingWithTraining = Booking & {
  training: Training;
};

export type BookingWithStudent = Booking & {
  student: Profile;
};

export type CreateTrainingInput = {
  title: string;
  type: TrainingType;
  startsAt: string;
  durationMin: number;
  capacity: number;
  location: string;
};

export class AppError extends Error {
  readonly code:
    | "NO_SESSIONS"
    | "ALREADY_BOOKED"
    | "FULL"
    | "NOT_FOUND"
    | "FORBIDDEN";

  constructor(
    code:
      | "NO_SESSIONS"
      | "ALREADY_BOOKED"
      | "FULL"
      | "NOT_FOUND"
      | "FORBIDDEN",
    message: string,
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
  }
}
