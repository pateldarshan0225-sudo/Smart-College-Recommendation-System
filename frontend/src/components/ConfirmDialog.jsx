import { useEffect, useRef } from 'react';
export default function ConfirmDialog({
  open,
  title = 'Delete this record?',
  message = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  busy = false
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (open && !ref.current.open) ref.current.showModal();
    if (!open && ref.current.open) ref.current.close();
  }, [open]);
  return <dialog ref={ref} onCancel={e => {
    e.preventDefault();
    if (!busy) onCancel();
  }} aria-labelledby="confirm-title">
  <h2 id="confirm-title">
    {title}
  </h2>
  <p>
    {message}
  </p>
  <div className="actions">
    <button className="button secondary" disabled={busy} onClick={onCancel}>Cancel</button>
    <button className="button danger" disabled={busy} onClick={onConfirm}>
      {busy ? 'Deleting...' : 'Delete'}
    </button>
  </div>
</dialog>;
}
