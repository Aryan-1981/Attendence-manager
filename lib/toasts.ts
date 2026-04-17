import { toast } from "sonner";

/**
 * Centralized toast helpers to keep copy/variants consistent across the app.
 * Keep these short and UI-first (Linear/Vercel style).
 */
export const toasts = {
  comingSoon(feature = "This") {
    return toast.message("Coming soon", {
      description: `${feature} will be available in a future update.`,
    });
  },

  exportStarted(label = "Export") {
    const id = toast.loading(`${label} in progress…`);
    return id;
  },

  exportSuccess(id?: string | number, label = "Export") {
    return toast.success(`${label} complete`, {
      id,
      description: "Downloaded to your device.",
    });
  },

  validationError(message: string) {
    return toast.error("Check required fields", {
      description: message,
    });
  },
};
