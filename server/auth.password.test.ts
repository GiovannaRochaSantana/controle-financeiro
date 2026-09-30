import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./routers";

describe("email password authentication", () => {
  it("stores a salted hash instead of the original password", () => {
    const password = "senha-segura-123";
    const storedHash = hashPassword(password);

    expect(storedHash).not.toContain(password);
    expect(storedHash.split(":")).toHaveLength(2);
    expect(verifyPassword(password, storedHash)).toBe(true);
  });

  it("rejects an incorrect password", () => {
    const storedHash = hashPassword("senha-segura-123");

    expect(verifyPassword("senha-incorreta", storedHash)).toBe(false);
  });

  it("uses a different salt for each password record", () => {
    const firstHash = hashPassword("senha-segura-123");
    const secondHash = hashPassword("senha-segura-123");

    expect(firstHash).not.toBe(secondHash);
    expect(verifyPassword("senha-segura-123", firstHash)).toBe(true);
    expect(verifyPassword("senha-segura-123", secondHash)).toBe(true);
  });
});
