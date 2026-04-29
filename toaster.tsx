import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        maxWidth: "420px",
      }}
    >
      {toasts.map(({ id, title, description, variant }) => (
        <div
          key={id}
          style={{
            background: variant === "destructive" ? "#7f1d1d" : "#1a1a1a",
            border: `1px solid ${variant === "destructive" ? "#dc2626" : "#b8860b"}`,
            borderRadius: "0.5rem",
            padding: "1rem",
            color: "#fff",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          {title && (
            <div style={{ fontWeight: 600, marginBottom: description ? "0.25rem" : 0 }}>
              {title}
            </div>
          )}
          {description && (
            <div style={{ fontSize: "0.875rem", opacity: 0.85 }}>{description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
