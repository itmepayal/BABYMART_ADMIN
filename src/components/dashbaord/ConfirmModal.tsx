import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  userName?: string;
};

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  loading,
  userName,
}: Props) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="relative z-10 w-full max-w-md 
        bg-white 
        rounded-2xl 
        border border-gray-200 
        shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)]
        p-6 
        animate-in fade-in zoom-in-95 duration-200"
      >
        {/* HEADER */}
        <div className="flex items-start justify-between border-b pb-3">
          <div className="flex items-center gap-3">
            {/* ICON */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>

            {/* TITLE */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Delete User
              </h2>
              <p className="text-xs text-gray-400">
                This action is irreversible
              </p>
            </div>
          </div>

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* BODY */}
        <div className="mt-5">
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">
              {userName || "this user"}
            </span>
            ? This action cannot be undone and all associated data will be
            permanently removed.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-3 border-t pt-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-lg 
              border border-gray-300 
              bg-white 
              hover:bg-gray-50 
              transition 
              disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg 
              bg-red-600 text-white 
              hover:bg-red-700 
              transition 
              disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
