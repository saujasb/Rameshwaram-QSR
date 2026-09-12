import app from "./app.js";

// Local development / Render entry point only. Route definitions live in
// ./app.ts, which is also what the Vercel serverless entry point
// (api/index.ts, repo root) imports -- this file's only job is starting a
// long-lived HTTP listener, which a Vercel serverless function must not do.
const PORT = Number(process.env.PORT ?? 4300);
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
