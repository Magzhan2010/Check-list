import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const icons = { success: CheckCircle2, error: XCircle, info: Info }
const styles = {
  success: 'border-emerald-200 text-emerald-700',
  error: 'border-rose-200 text-rose-700',
  info: 'border-indigo-200 text-indigo-700',
}

export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const s = styles[t.type] || styles.info
        const Icon = icons[t.type] || icons.info
        return (
          <div key={t.id}
            className={`pointer-events-auto bg-white border ${s} rounded-md shadow-md px-4 py-3 pr-9 min-w-[260px] max-w-[360px] relative`}>
            <div className="flex items-start gap-2">
              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                {t.title && <p className="font-semibold text-sm text-slate-900">{t.title}</p>}
                <p className="text-sm text-slate-600 break-words">{t.message}</p>
              </div>
              <button onClick={() => onDismiss(t.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
