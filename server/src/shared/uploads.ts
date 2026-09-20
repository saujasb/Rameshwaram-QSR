import { randomUUID } from "node:crypto";
import { Router } from "express";
import { waitUntil } from "@vercel/functions";
import { getSupabase } from "../db/client.js";

// Vercel Node.js functions cap the request body around 4.5MB, well under the
// 20-25MB sales/dataset import limits this app already advertises. Large
// files now go browser -> Supabase Storage (signed upload URL) -> server
// downloads-and-processes, instead of browser -> server function body.
export const IMPORT_BUCKET = "import-uploads";

const ALLOWED_CONTENT_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.ms-excel.sheet.macroEnabled.12",
]);

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_.-]/g, "_").slice(-120);
}

export const uploadsRouter: Router = Router();

/** Mint a one-time signed upload URL/token for a single file. */
uploadsRouter.post("/sign", async (req, res) => {
  const fileName = typeof req.body?.fileName === "string" ? req.body.fileName.trim() : "";
  const contentType = typeof req.body?.contentType === "string" ? req.body.contentType : "";
  if (!fileName) {
    res.status(400).json({ error: "fileName is required." });
    return;
  }
  if (contentType && !ALLOWED_CONTENT_TYPES.has(contentType)) {
    res.status(400).json({ error: "Unsupported content type.", detail: "Accepted: PDF, XLSX, XLS, XLSM." });
    return;
  }

  const path = `uploads/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${sanitizeFileName(fileName)}`;
  const { data, error } = await getSupabase().storage.from(IMPORT_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    res.status(500).json({ error: "Could not prepare the upload.", detail: error?.message });
    return;
  }

  res.json({ path: data.path, token: data.token, signedUrl: data.signedUrl });
});

/** Downloads a previously-uploaded file back into memory for processing. Deletes it once read. */
export async function downloadUpload(path: string): Promise<Buffer> {
  const { data, error } = await getSupabase().storage.from(IMPORT_BUCKET).download(path);
  if (error || !data) {
    throw new Error(`Could not read uploaded file "${path}": ${error?.message ?? "not found"}`);
  }
  const buffer = Buffer.from(await data.arrayBuffer());
  // Best-effort cleanup; a leftover object is harmless (bucket is private, no
  // PII beyond what the business already uploads), so failures aren't fatal.
  // waitUntil() (not a bare fire-and-forget promise) gives it a chance to
  // finish even if the response completes before the delete does.
  waitUntil(getSupabase().storage.from(IMPORT_BUCKET).remove([path]).then(() => {}, () => {}));
  return buffer;
}
