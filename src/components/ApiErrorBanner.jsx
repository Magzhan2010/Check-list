import { AlertTriangle, X, RefreshCw } from 'lucide-react'

export default function ApiErrorBanner({ message, onRetry, onDismiss }) {
  return (
    <div className="mt-4 card border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-md bg-rose-100 flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="w-5 h-5 text-rose-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-rose-900">Connection error</p>
        <p className="text-sm text-rose-700 mt-0.5 break-words">{message}</p>
        <button onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium">
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
      <button onClick={onDismiss}
        className="w-8 h-8 rounded-md hover:bg-rose-100 flex items-center justify-center text-rose-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
