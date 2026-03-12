import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Shared confirmation modal for admin actions (List/Unlist, Block/Unblock).
 * Matches the design used in employer flow.
 */
export default function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  loading = false,
  variant = "default", // "default" | "danger"
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-slate-200 bg-white shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-900 font-bold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600 text-sm">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
          <AlertDialogCancel
            disabled={loading}
            className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm?.();
            }}
            disabled={loading}
            className={
              variant === "danger"
                ? "rounded-xl bg-red-600 text-white hover:bg-red-700 font-semibold border-0"
                : "rounded-xl bg-amber-500 text-white hover:bg-amber-600 font-semibold border-0"
            }
          >
            {loading ? "Please wait…" : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
