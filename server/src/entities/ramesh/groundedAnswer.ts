import { classify } from "./intents.js";
import { answer as datasetAnswer } from "./engine.js";
import { computeLiveSalesFacts } from "./liveSalesFacts.js";
import type { RameshQuery } from "../../../../shared-types/ramesh.js";

export interface GroundedContext {
  /** Source-labeled facts text to hand to Gemini -- empty string means "no grounding, answer generally." */
  factsText: string;
  usedLiveSales: boolean;
  usedImportedData: boolean;
}

/**
 * Decides where a question's factual grounding should come from, and
 * computes it deterministically -- Gemini only ever phrases these numbers,
 * never invents or recomputes them (see gemini.ts).
 *
 * Routing (master task Part 1):
 *   - sales/orders/AOV/channel/Petpooja/Kiosk/item/category words, no
 *     production/wastage words -> ONLY provider_orders (live). Skipping the
 *     dataset_records engine here matters: dataset_records' "sales" type is
 *     currently empty, and letting it also answer would hand Gemini a
 *     contradictory "no sales data" fact alongside the real live numbers.
 *   - production/wastage words, no sales words -> ONLY the existing
 *     dataset_records engine, completely unchanged from before Gemini.
 *   - both -> both, each block clearly source-labeled (Part 1, Rule D).
 *   - neither -> still try the existing engine (it covers many intents --
 *     shift/outlet/product performance, anomalies, executive summary, help,
 *     data coverage -- that don't require the literal words "sales",
 *     "production" or "wastage"), so none of that pre-existing coverage
 *     regresses just because Gemini now sits in front of it.
 */
export async function buildGroundedContext(query: RameshQuery): Promise<GroundedContext> {
  const question = query.question;

  // Live-sales date/provider resolution deliberately omits `startHour`, so it
  // resolves "today"/"yesterday" against the shared 04:30 outlet business day
  // (shared-types/businessDate.ts's default) -- not dataset_records' own,
  // separately-configurable business-day-start-hour setting.
  const liveClassification = classify(question, {});
  const slots = liveClassification.slots;
  const mentionsOperational = (slots.datasetTypes ?? []).some((t) => t === "production" || t === "wastage");

  const liveFacts = await computeLiveSalesFacts(question, slots);

  let importedFactsText = "";
  if (mentionsOperational || !liveFacts.applies) {
    // Untouched deterministic engine (dataset_records) -- same call it always
    // was, using its own dataset-configured business-day-start-hour.
    const deterministic = await datasetAnswer(query);
    const isRealAnswer = deterministic.refusalReason == null && !deterministic.insufficientData;
    if (isRealAnswer) {
      const bits = [deterministic.answer, deterministic.conclusion].filter(Boolean);
      importedFactsText = `IMPORTED OPERATIONAL DATA (source: dataset_records, from Data Import/Excel/PDF reports):\n- ${bits.join("\n- ")}`;
    } else if (mentionsOperational) {
      // The question explicitly asked about production/wastage but the
      // deterministic engine has nothing -- say so plainly rather than
      // silently omitting it, so Gemini doesn't guess a number instead.
      importedFactsText = `IMPORTED OPERATIONAL DATA (source: dataset_records): No imported Production/Wastage/Sales report data is available to answer this part of the question.`;
    }
  }

  const parts = [liveFacts.applies ? liveFacts.factsText : "", importedFactsText].filter(Boolean);
  return {
    factsText: parts.join("\n\n"),
    usedLiveSales: liveFacts.applies,
    usedImportedData: importedFactsText.length > 0,
  };
}
