import { app } from "../server/src/app.js";

// Vercel's Node.js runtime invokes the default export directly as a
// (req, res) handler. Express apps are callable with that exact signature,
// so no adapter/wrapper is needed -- every route mounted in server/src/app.ts
// is served through this single function via the vercel.json rewrite.
export default app;
