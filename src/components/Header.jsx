import { RefreshCw } from 'lucide-react'

export default function Header({ onRefresh, refreshing }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">CheckList</h1>
          <p className="text-xs text-slate-500">Powered by FastAPI</p>
        </div>
      </div>

      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="btn-secondary"
      >
        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
      </button>
    </header>
  )
}
