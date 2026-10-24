import { createMockRepository } from "@/data/mockRepository";
import type { AppRepository } from "@/data/repository";

let repository: AppRepository | null = null;

export function getRepository(): AppRepository {
  if (!repository) {
    repository = createMockRepository();
  }
  return repository;
}
