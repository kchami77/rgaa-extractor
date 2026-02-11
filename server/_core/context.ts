import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { ENV } from "./env";
import * as db from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

/**
 * Mode développement local : crée automatiquement un utilisateur dev
 */
async function getDevUser(): Promise<User | null> {
  const devOpenId = "dev-local-user";
  let user = await db.getUserByOpenId(devOpenId);
  if (!user) {
    await db.upsertUser({
      openId: devOpenId,
      name: "Développeur Local",
      email: "dev@localhost",
      loginMethod: "local",
      role: "admin",
      lastSignedIn: new Date(),
    });
    user = await db.getUserByOpenId(devOpenId);
  }
  return user ?? null;
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // Mode dev local : pas d'OAuth, auto-login avec un utilisateur dev
  const isLocalDev = !ENV.oAuthServerUrl && !ENV.isProduction;
  if (isLocalDev) {
    user = await getDevUser();
  } else {
    try {
      user = await sdk.authenticateRequest(opts.req);
    } catch (error) {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
