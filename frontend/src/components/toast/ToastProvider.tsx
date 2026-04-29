import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ToastType = "success" | "error" | "info" | "warning" | "xp";

export type ToastInput = {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
};

type ToastItem = Required<Pick<ToastInput, "type" | "title" | "duration">> &
  Pick<ToastInput, "message"> & {
    id: string;
  };

type ToastContextValue = {
  showToast: (toast: ToastInput) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 4200;

const toastStyles: Record<
  ToastType,
  {
    label: string;
    icon: string;
    border: string;
    background: string;
    iconClass: string;
    titleClass: string;
  }
> = {
  success: {
    label: "Success",
    icon: "✓",
    border: "border-emerald-400/35",
    background: "bg-emerald-400/10",
    iconClass: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
    titleClass: "text-emerald-100",
  },
  error: {
    label: "Error",
    icon: "!",
    border: "border-rose-400/35",
    background: "bg-rose-400/10",
    iconClass: "border-rose-400/40 bg-rose-400/15 text-rose-200",
    titleClass: "text-rose-100",
  },
  info: {
    label: "Info",
    icon: "i",
    border: "border-aura-cyan/35",
    background: "bg-aura-cyan/10",
    iconClass: "border-aura-cyan/40 bg-aura-cyan/15 text-aura-cyan",
    titleClass: "text-aura-text",
  },
  warning: {
    label: "Warning",
    icon: "!",
    border: "border-aura-gold/35",
    background: "bg-aura-gold/10",
    iconClass: "border-aura-gold/40 bg-aura-gold/15 text-aura-gold",
    titleClass: "text-aura-gold",
  },
  xp: {
    label: "XP",
    icon: "✦",
    border: "border-aura-gold/40",
    background: "bg-aura-gold/10",
    iconClass: "border-aura-gold/50 bg-aura-gold/20 text-aura-gold",
    titleClass: "text-aura-gold",
  },
};

const createToastId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutRefs = useRef<Record<string, number>>({});

  const dismissToast = useCallback((id: string) => {
    const timeoutId = timeoutRefs.current[id];

    if (timeoutId) {
      window.clearTimeout(timeoutId);
      delete timeoutRefs.current[id];
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const showToast = useCallback(
    (toast: ToastInput) => {
      const id = createToastId();
      const duration = toast.duration ?? DEFAULT_DURATION;

      const nextToast: ToastItem = {
        id,
        type: toast.type ?? "info",
        title: toast.title,
        message: toast.message,
        duration,
      };

      setToasts((currentToasts) => {
        const updatedToasts = [nextToast, ...currentToasts];

        return updatedToasts.slice(0, 5);
      });

      if (duration > 0) {
        timeoutRefs.current[id] = window.setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast],
  );

  const clearToasts = useCallback(() => {
    Object.values(timeoutRefs.current).forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });

    timeoutRefs.current = {};
    setToasts([]);
  }, []);

  useEffect(() => {
    const handleExternalToast = (event: Event) => {
      const customEvent = event as CustomEvent<{
        type?: ToastType;
        title?: string;
        message?: string;
        duration?: number;
      }>;

      const detail = customEvent.detail;

      if (!detail) return;

      showToast({
        type: detail.type ?? "info",
        title: detail.title ?? "Notification",
        message: detail.message ?? "",
        duration: detail.duration,
      });
    };

    window.addEventListener("studyAura.toast", handleExternalToast);

    return () => {
      window.removeEventListener("studyAura.toast", handleExternalToast);
    };
  }, [showToast]);

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
      clearToasts,
    }),
    [showToast, dismissToast, clearToasts],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed inset-x-3 bottom-4 z-[2000] flex flex-col gap-3 sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-5 sm:w-[380px]">
        {toasts.map((toast) => {
          const styles = toastStyles[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto overflow-hidden rounded-2xl border ${styles.border} ${styles.background} bg-aura-panel/95 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl`}
              role="status"
              aria-live={toast.type === "error" ? "assertive" : "polite"}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-sm font-black ${styles.iconClass}`}
                  aria-hidden="true"
                >
                  {styles.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-aura-dim">
                        {styles.label}
                      </p>

                      <h3
                        className={`mt-1 text-sm font-black leading-5 ${styles.titleClass}`}
                      >
                        {toast.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => dismissToast(toast.id)}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-aura-border bg-aura-bg-soft text-xs font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text"
                      aria-label="Dismiss notification"
                    >
                      ×
                    </button>
                  </div>

                  {toast.message && (
                    <p className="mt-2 text-xs leading-5 text-aura-muted">
                      {toast.message}
                    </p>
                  )}

                  {toast.duration > 0 && (
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-aura-bg-soft">
                      <div
                        className="h-full origin-left animate-[toast-shrink_linear_forwards] rounded-full bg-aura-cyan"
                        style={{
                          animationDuration: `${toast.duration}ms`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
};