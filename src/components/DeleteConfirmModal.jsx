import { useState } from 'react'
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react'
import { Backdrop } from './TaskForm'
import { PRIORITY_META } from '../api/tasks'

export default function DeleteConfirmModal({ task, onCancel, onConfirm }) {
  const [deleting, setDeleting] = useState(false)
  const meta = PRIORITY_META[task.priority] || PRIORITY_META.Medium

  const handleConfirm = async () => {
    setDeleting(true)
    await onConfirm()
    setDeleting(false)
  }

  return (
    <Backdrop onClose={onCancel}>
      <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-md bg-rose-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Delete this task?</h2>
            <p className="text-sm text-slate-500 mt-1">This action can&apos;t be undone.</p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-md bg-slate-50 border border-slate-200">
          <p className="text-slate-800 font-medium text-sm break-words">{task.title}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`pill ${meta.bg} ${meta.text}`}>{meta.label}</span>
            <span className="text-xs text-slate-500">{task.category}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onCancel} className="btn-secondary flex-1" disabled={deleting}>Cancel</button>
          <button onClick={handleConfirm} disabled={deleting} className="btn-danger flex-1">
            {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : <><Trash2 className="w-4 h-4" /> Delete</>}
          </button>
        </div>
      </div>
    </Backdrop>
  )
}
