"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";

// ─── Context ────────────────────────────────────────────────────────
const NotifContext = createContext(null);

export function useNotif() {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error("useNotif must be used within <NotifProvider>");
  return ctx;
}

// ─── Icons ──────────────────────────────────────────────────────────
const icons = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// ─── Color Schemes ──────────────────────────────────────────────────
const colorSchemes = {
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    border: "border-emerald-200 dark:border-emerald-800/60",
    icon: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    title: "text-emerald-800 dark:text-emerald-300",
    message: "text-emerald-700 dark:text-emerald-400",
    progress: "bg-emerald-500",
    close: "text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-950/60",
    border: "border-red-200 dark:border-red-800/60",
    icon: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/50",
    title: "text-red-800 dark:text-red-300",
    message: "text-red-700 dark:text-red-400",
    progress: "bg-red-500",
    close: "text-red-400 hover:text-red-600 dark:hover:text-red-300",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/60",
    border: "border-amber-200 dark:border-amber-800/60",
    icon: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    title: "text-amber-800 dark:text-amber-300",
    message: "text-amber-700 dark:text-amber-400",
    progress: "bg-amber-500",
    close: "text-amber-400 hover:text-amber-600 dark:hover:text-amber-300",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/60",
    border: "border-blue-200 dark:border-blue-800/60",
    icon: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    title: "text-blue-800 dark:text-blue-300",
    message: "text-blue-700 dark:text-blue-400",
    progress: "bg-blue-500",
    close: "text-blue-400 hover:text-blue-600 dark:hover:text-blue-300",
  },
};

const defaultTitles = {
  success: "Berhasil",
  error: "Gagal",
  warning: "Peringatan",
  info: "Informasi",
};

// ─── Single Toast Item ──────────────────────────────────────────────
function ToastItem({ id, type = "info", title, message, duration = 4000, onRemove }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(100);

  const colors = colorSchemes[type] || colorSchemes.info;
  const displayTitle = title || defaultTitles[type] || "Notifikasi";

  const dismiss = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => onRemove(id), 300);
  }, [id, onRemove]);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  useEffect(() => {
    if (duration <= 0) return;

    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          dismiss();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, dismiss]);

  return (
    <div
      className={`
        relative w-full max-w-sm overflow-hidden
        rounded-2xl border backdrop-blur-xl shadow-2xl
        transition-all duration-300 ease-out
        ${colors.bg} ${colors.border}
        ${isVisible && !isLeaving
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-8 opacity-0 scale-95"
        }
      `}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${colors.iconBg} ${colors.icon}`}>
          {icons[type] || icons.info}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className={`text-[11px] font-black uppercase tracking-[0.15em] leading-none mb-1 ${colors.title}`}>
            {displayTitle}
          </p>
          <p className={`text-sm font-semibold leading-snug ${colors.message}`}>
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={dismiss}
          className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-90 ${colors.close}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="h-1 w-full bg-black/5 dark:bg-white/5">
          <div
            className={`h-full ${colors.progress} transition-all ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Provider & Container ───────────────────────────────────────────
let globalId = 0;

export function NotifProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((type, message, options = {}) => {
    const id = ++globalId;
    const toast = {
      id,
      type,
      message,
      title: options.title || null,
      duration: options.duration ?? 4000,
    };
    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  // Shorthand methods
  const success = useCallback((msg, opts) => notify("success", msg, opts), [notify]);
  const error   = useCallback((msg, opts) => notify("error", msg, opts), [notify]);
  const warning = useCallback((msg, opts) => notify("warning", msg, opts), [notify]);
  const info    = useCallback((msg, opts) => notify("info", msg, opts), [notify]);

  const contextValue = { notify, success, error, warning, info };

  return (
    <NotifContext.Provider value={contextValue}>
      {children}

      {/* Toast container — fixed top-right */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem
              id={t.id}
              type={t.type}
              title={t.title}
              message={t.message}
              duration={t.duration}
              onRemove={removeToast}
            />
          </div>
        ))}
      </div>
    </NotifContext.Provider>
  );
}
