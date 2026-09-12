import type { Request, Response, RequestHandler } from "express";

/**
 * Express 4 does not catch a rejected promise returned from an async route
 * handler -- left unwrapped, a database error there just hangs the request
 * forever instead of producing a response. Every async route handler in
 * this server (Stage 3 onward) is wrapped with this so a thrown/rejected
 * error becomes a clean 500 instead.
 */
export function asyncHandler(handler: (req: Request, res: Response) => Promise<void>): RequestHandler {
  return (req, res, next) => {
    handler(req, res).catch((err: unknown) => {
      console.error("[api] Unhandled error:", err instanceof Error ? err.stack ?? err.message : err);
      if (res.headersSent) {
        next(err);
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    });
  };
}
