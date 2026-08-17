import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import type { RameshAnswer, RameshMessage } from "@shared/ramesh";
import { RAMESH_IDENTITY } from "@shared/ramesh";
import { useAskRamesh, useRameshSuggestions } from "../../lib/api/ramesh";
import "./ramesh.css";

/** The genuine Rameshwaram brand mark, already shipped in client/public/branding. */
const LOGO = "/branding/emblem.png";

function drilldownPath(query: Record<string, string> | null): string | null {
  if (!query || Object.keys(query).length === 0) return null;
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v) p.set(k, v);
  return `/data-explorer?${p.toString()}`;
}

function AnswerBody({ answer }: { answer: RameshAnswer }) {
  // A refusal is just the reply -- rendering empty "Data Used"/"Calculation"
  // shells would imply a computation happened.
  if (answer.refusalReason) {
    return (
      <>
        <div className="ramesh-answer-text">{answer.answer}</div>
        {answer.conclusion && <div className="ramesh-refusal ramesh-meta" style={{ marginTop: 6 }}>{answer.conclusion}</div>}
      </>
    );
  }

  const du = answer.dataUsed;
  const drill = drilldownPath(answer.drilldownQuery);

  return (
    <>
      <div className="ramesh-section">
        <div className="ramesh-section-label">Answer</div>
        <div className="ramesh-answer-text">{answer.answer}</div>
      </div>

      {du && (
        <div className="ramesh-section">
          <div className="ramesh-section-label">Data Used</div>
          <div className="ramesh-meta">
            {du.datasets.length ? du.datasets.join(", ") : "—"}
            {du.businessDateFrom && (
              <> · {du.businessDateFrom}{du.businessDateTo && du.businessDateTo !== du.businessDateFrom ? ` → ${du.businessDateTo}` : ""}</>
            )}
            {du.product && <> · {du.product}</>}
            {du.outlet && <> · {du.outlet}</>}
            {du.shift && <> · {du.shift}</>}
            {" · "}{du.recordCount.toLocaleString()} record{du.recordCount === 1 ? "" : "s"}
          </div>
        </div>
      )}

      {answer.calculation.length > 0 && (
        <div className="ramesh-section">
          <div className="ramesh-section-label">Calculation</div>
          <div className="ramesh-calc">
            {answer.calculation.map((step, i) => (
              <div className="ramesh-calc-step" key={i}>
                <div className="ramesh-calc-label">{step.label}</div>
                <div className="ramesh-calc-expr">{step.expression}</div>
                <div className="ramesh-calc-result">= {step.result}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {answer.insights.length > 0 && (
        <div className="ramesh-section">
          <div className="ramesh-section-label">Insights ({answer.insights.length})</div>
          <div className="ramesh-insights">
            {answer.insights.map((ins) => {
              const drill = drilldownPath(ins.drilldownQuery);
              return (
                <div className={`ramesh-insight sev-${ins.severity}`} key={`${ins.rank}-${ins.headline}`}>
                  <div className="ramesh-insight-head">
                    <span className="ramesh-insight-rank">{ins.rank}</span>
                    <b>{ins.headline}</b>
                  </div>
                  <div className="ramesh-insight-grid">
                    <span className="k">How much</span><span>{ins.magnitude}</span>
                    {ins.scope && <><span className="k">When / where</span><span>{ins.scope}</span></>}
                    {ins.impact && <><span className="k">Impact</span><span>{ins.impact}</span></>}
                    {ins.action && <><span className="k">Action</span><span>{ins.action}</span></>}
                  </div>
                  {drill && <Link className="ramesh-insight-drill" to={drill}>View records →</Link>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {answer.conclusion && (
        <div className="ramesh-section">
          <div className="ramesh-section-label">Conclusion</div>
          <div className="ramesh-conclusion">{answer.conclusion}</div>
        </div>
      )}

      {drill && <Link className="ramesh-drill" to={drill}>View records →</Link>}
    </>
  );
}

export function RameshWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<RameshMessage[]>([]);
  const ask = useAskRamesh();
  const { data: starter } = useRameshSuggestions();
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, ask.isPending]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function submit(question: string) {
    const q = question.trim();
    if (!q || ask.isPending) return;
    const stamp = new Date().toISOString();
    setMessages((m) => [...m, { id: `u-${stamp}-${m.length}`, role: "user", text: q, timestamp: stamp }]);
    setDraft("");
    ask.mutate(
      { question: q },
      {
        onSuccess: (answer) => {
          setMessages((m) => [
            ...m,
            { id: `r-${Date.now()}-${m.length}`, role: "ramesh", text: answer.answer, answer, timestamp: new Date().toISOString() },
          ]);
        },
        onError: (err) => {
          setMessages((m) => [
            ...m,
            {
              id: `e-${Date.now()}-${m.length}`,
              role: "ramesh",
              text: err instanceof Error ? err.message : "Something went wrong reaching the data layer.",
              timestamp: new Date().toISOString(),
            },
          ]);
        },
      }
    );
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(draft);
    }
  }

  if (!open) {
    return (
      <button className="ramesh-launcher" onClick={() => setOpen(true)} aria-label="Open Ramesh, the Rameshwaram Intelligence Assistant">
        <img src={LOGO} alt="Ramesh" />
        <span className="ramesh-launcher-badge">Ask</span>
      </button>
    );
  }

  const lastAnswer = [...messages].reverse().find((m) => m.role === "ramesh")?.answer;
  const chips = messages.length === 0 ? (starter?.suggestions ?? []) : (lastAnswer?.suggestions ?? []);

  return (
    <div className="ramesh-panel" role="dialog" aria-label="Ramesh — Rameshwaram Intelligence Assistant">
      <div className="ramesh-head">
        <img src={LOGO} alt="" aria-hidden />
        <div>
          <div className="ramesh-head-name">Ramesh</div>
          <div className="ramesh-head-sub">{RAMESH_IDENTITY.replace("Ramesh — ", "")}</div>
        </div>
        <button className="ramesh-close" onClick={() => setOpen(false)} aria-label="Close Ramesh">×</button>
      </div>

      <div className="ramesh-log" ref={logRef} role="log" aria-live="polite">
        {messages.length === 0 && (
          <div className="ramesh-intro">
            <b>Ask me about your imported business data.</b> I only answer from records in this dashboard, and I always
            show the calculation behind the number — so you can check my working.
            {starter && !starter.hasData && (
              <> Nothing has been imported yet, so there is nothing for me to compute. Import a sales report first.</>
            )}
          </div>
        )}

        {messages.map((m) => (
          <div className={`ramesh-msg ${m.role}`} key={m.id}>
            {m.role === "ramesh" && <img className="ramesh-avatar" src={LOGO} alt="" aria-hidden />}
            <div className="ramesh-bubble">{m.answer ? <AnswerBody answer={m.answer} /> : m.text}</div>
          </div>
        ))}

        {ask.isPending && (
          <div className="ramesh-msg ramesh">
            <img className="ramesh-avatar" src={LOGO} alt="" aria-hidden />
            <div className="ramesh-bubble">
              <div className="ramesh-thinking">
                <img src={LOGO} alt="" aria-hidden />
                Working through the records…
              </div>
            </div>
          </div>
        )}

        {chips.length > 0 && !ask.isPending && (
          <div className="ramesh-chips">
            {chips.slice(0, 4).map((s) => (
              <button className="ramesh-chip" key={s} onClick={() => submit(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <div className="ramesh-input-row">
        <textarea
          ref={inputRef}
          value={draft}
          maxLength={500}
          placeholder="e.g. what were total sales yesterday?"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Ask Ramesh a question about your business data"
        />
        <button className="btn primary" onClick={() => submit(draft)} disabled={!draft.trim() || ask.isPending}>
          Ask
        </button>
      </div>
    </div>
  );
}
