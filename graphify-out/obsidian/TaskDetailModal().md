---
source_file: "client/src/modules/tasks/TaskDetailModal.tsx"
type: "code"
community: "Generic CRUD UI Components"
location: "L9"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Generic_CRUD_UI_Components
---

# TaskDetailModal()

## Connections
- [[TaskDetailModal.tsx]] - `contains` [EXTRACTED]
- [[TasksPage.tsx]] - `imports` [EXTRACTED]

## Source
**From** `client/src/modules/tasks/TaskDetailModal.tsx` **(starting line 9):**
```tsx
export function TaskDetailModal({ task, onClose }: { task: Task; onClose: () => void }) {
  const update = taskHooks.useUpdate();
  const remove = taskHooks.useRemove();
  const completeAction = taskHooks.useAction<Task>("complete");
  const reassignAction = taskHooks.useAction<Task>("reassign");
  const noteAction = taskHooks.useAction<Task>("note");
  const issueAction = taskHooks.useAction<Task>("report-issue");
  const verifyAction = taskHooks.useAction<Task>("verify");

  const [showHistory, setShowHistory] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [issueText, setIssueText] = useState("");
  const [reassignTo, setReassignTo] = useState(task.assignedEmployee ?? "");
  const [verifierName, setVerifierName] = useState("");

  return (
    <Modal title={task.name} onClose={onClose}>
      <div style={{ marginBottom: 14 }}>
        <StatusBadge label={task.status.replace("_", " ")} tone={task.status === "completed" ? "ok" : task.status === "failed" ? "over" : "neutral"} />
        {task.sopReference && <span style={{ marginLeft: 10, fontSize: 12, color: "var(--muted)" }}>{task.sopReference}</span>}
      </div>

      <div className="btn-row" style={{ marginTop: 0 }}>
        <button className="btn primary small" onClick={() => completeAction.mutate({ id: task.id })}>Complete</button>
        <button className="btn small" onClick={() => setShowHistory((v) => !v)}>{showHistory ? "Hide" : "View"} history</button>
      </div>

      {showHistory && (
        <div className="card" style={{ marginTop: 12 }}>
          {task.history.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 13 }}>No history yet.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5 }}>
              {task.history.map((h, i) => (
                <li key={i}>
                  <b>{h.action.replace("_", " ")}</b> — {new Date(h.timestamp).toLocaleString()}
                  {h.note ? `: ${h.note}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid2" style={{ marginTop: 16 }}>
        <div>
          <h4 style={{ fontSize: 13, marginBottom: 6 }}>Reassign</h4>
          <div className="field">
            <input placeholder="Employee name" value={reassignTo} onChange={(e) => setReassignTo(e.target.value)} />
          </div>
          <button className="btn small" style={{ marginTop: 8 }} onClick={() => reassignAction.mutate({ id: task.id, body: { assignedEmployee: reassignTo } })}>
            Reassign
          </button>
        </div>
        <div>
          <h4 style={{ fontSize: 13, marginBottom: 6 }}>Verify</h4>
          <div className="field">
            <input placeholder="Verifier name" value={verifierName} onChange={(e) => setVerifierName(e.target.value)} />
          </div>
          <button className="btn small" style={{ marginTop: 8 }} onClick={() => verifyAction.mutate({ id: task.id, body: { verifiedBy: verifierName } })}>
            Verify
          </button>
        </div>
      </div>

      <div className="grid2" style={{ marginTop: 16 }}>
        <div>
          <h4 style={{ fontSize: 13, marginBottom: 6 }}>Add note</h4>
          <div className="field">
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} />
          </div>
          <button className="btn small" style={{ marginTop: 8 }} onClick={() => noteAction.mutate({ id: task.id, body: { note: noteText } })}>
            Add note
          </button>
        </div>
        <div>
          <h4 style={{ fontSize: 13, marginBottom: 6 }}>Report issue</h4>
          <div className="field">
            <textarea value={issueText} onChange={(e) => setIssueText(e.target.value)} />
          </div>
          <button className="btn small" style={{ marginTop: 8 }} onClick={() => issueAction.mutate({ id: task.id, body: { issue: issueText } })}>
            Report issue
          </button>
        </div>
      </div>

      <h4 style={{ fontSize: 13, margin: "18px 0 6px" }}>Edit task details</h4>
      <RecordForm
        fields={taskFormFields}
        initialValues={task as unknown as Record<string, unknown>}
        submitLabel="Update"
        onCancel={onClose}
        onSubmit={(values) => update.mutate({ id: task.id, patch: values as Partial<Omit<Task, keyof BaseRecord>> }, { onSuccess: onClose })}
      />
      <div className="btn-row">
        <button className="btn" style={{ color: "var(--critical)" }} onClick={() => { remove.mutate(task.id); onClose(); }}>
          Delete task
        </button>
      </div>
    </Modal>
  );
}
```

#graphify/code #graphify/EXTRACTED #community/Generic_CRUD_UI_Components