import app from "../server/src/app.js";

// Vercel serverless entry point (Node.js runtime). Vercel's Node.js request
// bridge calls this default export exactly like any (req, res) HTTP request
// listener; an Express app *is* one (the same signature `http.createServer`
// expects), so no adapter/wrapper package (e.g. @vercel/node's helpers) is
// needed -- this is Vercel's own documented pattern for deploying an
// existing Express app unchanged:
// https://vercel.com/docs/frameworks/backend/express
//
// All actual route definitions live in server/src/app.ts and are not
// duplicated here. vercel.json rewrites every /api/* request to this single
// function, and because Vercel's routing preserves the original request
// path/method/headers/body when invoking the function (the rewrite only
// selects *which* function handles the request, not what path the function
// itself observes), Express's own router still sees the full original path
// (e.g. "/api/sales/summary") and dispatches exactly as it does locally.
export default app;
