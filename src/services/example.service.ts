import { randomUUID } from "node:crypto";
import { type User, UserSchema } from "@/schemas/example.schema";

// In-memory demo storage (you should prefer using a database)
const users = new Map<string, User>();

export function createUser(input: Omit<User, "id">): User {
  const id = randomUUID();
  const user = UserSchema.parse({ id, ...input });
  users.set(id, user);
  return user;
}

export function getUser(id: string): User | undefined {
  return users.get(id);
}

export function listUsers(): User[] {
  return [...users.values()];
}
