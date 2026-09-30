import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("financial procedures", () => {
  it("does not expose transactions without an authenticated user", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(caller.transactions.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("does not expose the savings goal without an authenticated user", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(caller.savings.goal()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
