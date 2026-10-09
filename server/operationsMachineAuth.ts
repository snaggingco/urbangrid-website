import crypto from "node:crypto";
import type { Request, RequestHandler } from "express";
import { validOperationsKey } from "./operationsContract";

// Machine calls never use browser sessions or expose the private credential.
export function operationsMachineAuthorized(req: Pick<Request, "get">) {
  const key = process.env.URBANGRID_NETWORK_INTEGRATION_KEY;
  const supplied = req.get("x-urbangrid-key");
  return process.env.NODE_ENV === "production" && validOperationsKey(key) &&
    typeof supplied === "string" && supplied.length <= 256 &&
    crypto.timingSafeEqual(
      crypto.createHash("sha256").update(key).digest(),
      crypto.createHash("sha256").update(supplied).digest(),
    );
}

export const requireOperationsMachine: RequestHandler = (req, res, next) => {
  res.set("Cache-Control", "no-store");
  if (!operationsMachineAuthorized(req)) {
    res.status(401).json({ errorCode: "UNAUTHORIZED" }); return;
  }
  next();
};

export function syntheticBookingContact(input: { name: string; email: string; project: string; phone: string }) {
  return input.name.startsWith("UrbanGrid PRODUCTION INTEGRATION TEST") &&
    input.email.endsWith("@example.invalid") &&
    input.project.startsWith("INTEGRATION TEST") && input.phone === "+971000000000";
}
