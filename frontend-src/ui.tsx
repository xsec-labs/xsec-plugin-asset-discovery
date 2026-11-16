import { forwardRef, useRef, type ReactNode } from "react";
import { Badge, Button as SharedButton, Dialog, EmptyState as SharedEmptyState, ErrorState as SharedErrorState, Select as SharedSelect, type ButtonProps, type SelectProps } from "@xsec/ui-react";
import { collectionBucket, statusLabel } from "./utils";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ className = "", children, variant, size, ...props }, ref) {
  const classes = new Set(className.split(/\s+/));
  const resolvedVariant = variant ?? (classes.has("danger") ? "danger" : classes.has("primary") ? "primary" : classes.has("text") ? "ghost" : "outline");
  const resolvedSize = size ?? (classes.has("compact") ? "sm" : "md");
  return <SharedButton {...props} ref={ref} variant={resolvedVariant} size={resolvedSize} className={className.split(/\s+/).filter(name => !["danger", "primary", "text", "compact"].includes(name)).join(" ")}>{children}</SharedButton>;
});

export function Select({ onChange, ...props }: Omit<SelectProps, "onValueChange"> & { onChange: (value: string) => void }) {
  return <SharedSelect {...props} onValueChange={next => {
    const selected = props.options.find(option => option.value === next);
    if (!selected) throw new Error("Invalid plugin selection");
    onChange(selected.value);
  }} />;
}

export function StatusBadge({ status }: { status: string }) {
  const bucket = collectionBucket(status);
  return <Badge tone={bucket === "completed" ? "success" : bucket === "failed" ? "danger" : bucket === "running" ? "warning" : "neutral"}>{statusLabel(status)}</Badge>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return typeof children === "string" ? <SharedEmptyState title={children} /> : <SharedEmptyState title="收集任务" action={children} />;
}

export function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return <SharedErrorState title="读取失败" description={error} action={<Button size="sm" onClick={onRetry}>重新读取</Button>} />;
}

export function Notice({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return <div className="ad-notice"><span>{children}</span>{action}</div>;
}

export function Modal({
  title,
  children,
  onClose,
  footer,
  busy = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer: ReactNode;
  busy?: boolean;
}) {
  const content = useRef<HTMLDivElement>(null);
  return <Dialog open title={title} className="ad-shared-dialog" initialFocus={interaction => interaction === "touch" ? true : content.current?.querySelector<HTMLElement>("input:not([disabled]),textarea:not([disabled]),.xui-select-trigger:not([disabled])") ?? true} preventOutsideDismissal={busy} onOpenChange={open => { if (!open && !busy) onClose(); }} footer={footer}><div ref={content}>{children}</div></Dialog>;
}

export function ConfirmModal({
  title,
  detail,
  confirmLabel,
  danger = false,
  busy = false,
  onClose,
  onConfirm,
}: {
  title: string;
  detail: string;
  confirmLabel: string;
  danger?: boolean;
  busy?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const close = () => { if (!busy) onClose(); };
  return <Modal title={title} busy={busy} onClose={close} footer={<><Button disabled={busy} onClick={close}>取消</Button><Button variant={danger ? "danger" : "primary"} loading={busy} onClick={onConfirm}>{confirmLabel}</Button></>}><p className="ad-confirm-detail">{detail}</p></Modal>;
}

export function Section({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="ad-section">
      <div className="ad-section-title"><strong>{title}</strong><span>{actions}</span></div>
      <div className="ad-section-body">{children}</div>
    </section>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return <svg className="ad-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

export function RefreshIcon() {
  return <Icon><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></Icon>;
}

export function PlusIcon() {
  return <Icon><path d="M5 12h14" /><path d="M12 5v14" /></Icon>;
}

/** The mark of one collection stage: done, active, failed, skipped or pending. */
export function StageMark({ state }: { state: string }) {
  return <span className="ad-stage-mark" aria-hidden="true"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    {state === "done" ? <path d="M20 6 9 17l-5-5" /> : null}
    {state === "failed" ? <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></> : null}
    {state === "skipped" ? <path d="M6 12h12" /> : null}
  </svg></span>;
}
