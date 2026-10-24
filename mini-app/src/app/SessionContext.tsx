import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getRepository } from "@/data/getRepository";
import type { AppRepository } from "@/data/repository";
import {
  initTelegram,
  resolveCurrentUser,
} from "@/shared/lib/telegram";
import type { Profile } from "@/types/domain";
import type { TelegramUser } from "@/types/telegram";

type Session =
  | { status: "loading" }
  | { status: "anonymous" }
  | {
      status: "ready";
      telegramUser: TelegramUser;
      profile: Profile;
      isAdmin: boolean;
      repo: AppRepository;
    };

const SessionContext = createContext<Session>({ status: "loading" });

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({ status: "loading" });

  useEffect(() => {
    initTelegram();
    const user = resolveCurrentUser();
    if (!user) {
      setSession({ status: "anonymous" });
      return;
    }

    const repo = getRepository();
    void repo.ensureProfile(user).then((profile) => {
      setSession({
        status: "ready",
        telegramUser: user,
        profile,
        isAdmin: profile.role === "admin",
        repo,
      });
    });
  }, []);

  return (
    <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
  );
}

export function useSession(): Session {
  return useContext(SessionContext);
}

export function useReadySession() {
  const session = useSession();
  if (session.status !== "ready") {
    throw new Error("Session is not ready");
  }
  return session;
}

export function useTick() {
  const [tick, setTick] = useState(0);
  const refresh = useMemo(() => () => setTick((value) => value + 1), []);
  return { tick, refresh };
}
