"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2, AlertCircle, HelpCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ConfirmOptions = {
  title: string;
  message: string;
};

type NotificationContextType = {
  showToast: (message: string, type?: ToastType) => void;
  confirmCustom: (options: ConfirmOptions) => Promise<boolean>;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<{
    options: ConfirmOptions;
    resolve: (val: boolean) => void;
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const confirmCustom = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ options, resolve });
    });
  }, []);

  const handleConfirmResponse = (value: boolean) => {
    if (confirmState) {
      confirmState.resolve(value);
      setConfirmState(null);
    }
  };

  return (
    <NotificationContext.Provider value={{ showToast, confirmCustom }}>
      {children}

      <div className="fixed top-24 right-4 z-50 flex flex-col gap-3 w-full max-w-xs md:max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border bg-surface shadow-lg animate-slideIn transition-all duration-300 w-full`}
          >
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            )}
            <p className="text-sm font-semibold text-heading flex-1">{toast.message}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-text-muted hover:text-heading transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {confirmState && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full border border-border p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-heading">{confirmState.options.title}</h3>
            </div>
            <p className="text-text text-sm md:text-base leading-relaxed mb-6">
              {confirmState.options.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleConfirmResponse(false)}
                className="px-5 py-2.5 rounded-xl border border-border text-heading font-bold hover:bg-primary/5 transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmResponse(true)}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition-colors cursor-pointer text-sm shadow-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
