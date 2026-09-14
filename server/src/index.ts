import { app } from "./app.js";

// Local-development entry point only. Vercel invokes the same `app` directly
// via api/index.ts and never runs this file.
const PORT = Number(process.env.PORT ?? 4300);
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
