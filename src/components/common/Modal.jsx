import { useEffect } from "react";

export default function Modal({
  children,
  footer,
  isOpen,
  onClose,
  title,
  closeDisabled = false,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !closeDisabled) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDisabled, isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropMouseDown = () => {
    if (!closeDisabled) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4
       bg-black/60 backdrop-blur-sm modal-backdrop-enter"
      onMouseDown={handleBackdropMouseDown}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10
         bg-slate-900 shadow-2xl modal-panel-enter"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-white">
            {title}
          </h2>

          <button
            type="button"
            disabled={closeDisabled}
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-400 transition
             hover:bg-white/10 hover:text-white disabled:opacity-50"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
