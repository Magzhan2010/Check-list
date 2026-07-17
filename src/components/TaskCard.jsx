import { Check, Pencil, Trash2, Calendar, Tag } from 'lucide-react'
import { PRIORITY_META } from '../api/tasks'
import { formatRelativeTime } from '../utils/format'

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const meta = PRIORITY_META[task.priority] || PRIORITY_META.Medium
  const completed = !!task.completed

  return (
    <div className={`card p-4 group ${completed ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0
            ${completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 hover:border-emerald-500'}`}
        >
          {completed && <Check className="w-3 h-3" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-slate-800 leading-snug break-words ${completed ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`pill ${meta.bg} ${meta.text}`}>{meta.label}</span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Tag className="w-3 h-3" />{task.category || 'Uncategorized'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          {task.created_at && (
            <>
              <Calendar className="w-3 h-3" />
              <span>{formatRelativeTime(task.created_at)}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit}
            className="w-7 h-7 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete}
            className="w-7 h-7 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
