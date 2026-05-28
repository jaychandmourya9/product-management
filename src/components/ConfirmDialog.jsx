export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6">
      <div className="w-full max-w-xl rounded-[32px] border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/50">
        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-rose-400/90">Confirm action</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{title}</h3>
            <p className="mt-2 text-slate-400">{description}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/70 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white hover:text-white sm:w-auto"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 sm:w-auto"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
