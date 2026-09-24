import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Express 4 doesn't catch rejected promises from async handlers; an
 * unexpected throw (e.g. the database being briefly unreachable) would
 * otherwise become an unhandled rejection instead of a 500. This forwards it
 * to the app's error handler.
 */
export function asyncRoute(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
