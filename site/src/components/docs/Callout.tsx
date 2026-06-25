"use client";

import { Info, AlertTriangle, CheckCircle2, XCircle, Lightbulb } from "lucide-react";

type CalloutType = "info" | "warning" | "success" | "error" | "tip";

interface CalloutProps {
  type: CalloutType;
  children: React.ReactNode;
}

const CALLOUT_CONFIG: Record<CalloutType, { icon: typeof Info; color: string; label: string }> = {
  info: { icon: Info, color: "var(--color-info)", label: "Info" },
  warning: { icon: AlertTriangle, color: "var(--color-warning)", label: "Warning" },
  success: { icon: CheckCircle2, color: "var(--color-success)", label: "Success" },
  error: { icon: XCircle, color: "var(--color-error)", label: "Error" },
  tip: { icon: Lightbulb, color: "var(--color-tip)", label: "Tip" },
};

export function Callout({ type, children }: CalloutProps) {
  const config = CALLOUT_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      className="my-6 rounded-card"
      style={{
        background: "var(--color-warm-white)",
        borderLeft: `4px solid ${config.color}`,
        padding: "16px 20px",
        borderRadius: "0 8px 8px 0",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={20} style={{ color: config.color }} />
        <span
          className="text-body-md"
          style={{ color: config.color, fontWeight: 600, fontSize: "14px" }}
        >
          {config.label}
        </span>
      </div>
      <div className="text-body" style={{ color: "var(--color-text)" }}>
        {children}
      </div>
    </div>
  );
}
