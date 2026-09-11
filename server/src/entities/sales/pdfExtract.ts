// pdf-parse's default text builder concatenates every text run on a line with
// no separator when the source PDF has no literal space glyph between them --
// which is exactly how table columns are laid out (e.g. an item-name cell
// directly followed by a category cell). That glues "Filter Coffee" and
// "Beverages" into "Filter CoffeeBeverages" with no way to tell them apart.
//
// To recover the table structure we supply our own page renderer: group each
// page's text items by their y position (one group per visual line), sort
// each line by x position, and join the cells with a tab. Every table cell in
// these reports is already a single text run in the PDF content stream, so
// this reconstructs the original rows losslessly.
// Import the internal implementation directly, not the package root: pdf-parse's
// index.js has a `!module.parent` debug branch that (under ESM/tsx interop)
// misfires and tries to read a bundled test fixture that isn't shipped.
// @ts-expect-error -- no published types for this subpath
import pdf from "pdf-parse/lib/pdf-parse.js";

const LINE_Y_TOLERANCE = 2;

interface TextItem {
  str: string;
  transform: number[];
}

function groupIntoRows(items: TextItem[]): string[][] {
  const lines: { y: number; cells: { x: number; str: string }[] }[] = [];
  for (const item of items) {
    if (!item.str || !item.str.trim()) continue;
    const y = item.transform[5];
    const x = item.transform[4];
    let line = lines.find((l) => Math.abs(l.y - y) < LINE_Y_TOLERANCE);
    if (!line) {
      line = { y, cells: [] };
      lines.push(line);
    }
    line.cells.push({ x, str: item.str.trim() });
  }
  lines.sort((a, b) => b.y - a.y);
  return lines.map((l) =>
    l.cells
      .sort((a, b) => a.x - b.x)
      .map((c) => c.str)
      .filter(Boolean)
  );
}

/**
 * Extracts every non-empty row from a PDF as an array of trimmed cell
 * strings, preserving reading order across pages. Blank lines and page
 * boundaries are dropped -- callers key off row content, not page geometry.
 */
export async function extractPdfRows(buffer: Buffer): Promise<string[][]> {
  const allRows: string[][] = [];
  await pdf(buffer, {
    pagerender: async (pageData: { getTextContent: () => Promise<{ items: TextItem[] }> }) => {
      const content = await pageData.getTextContent();
      const rows = groupIntoRows(content.items);
      allRows.push(...rows);
      return "";
    },
  });
  return allRows.filter((r) => r.length > 0);
}
