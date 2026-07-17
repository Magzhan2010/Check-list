import { ClipboardList, Plus } from 'lucide-react'

export default function EmptyState({ hasTasks, onAdd }) {
  return (
    <div className="card p-10 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-md bg-slate-100 flex items-center justify-center">
        <ClipboardList className="w-7 h-7 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mt-4">
        {hasTasks ? 'No tasks match your filters' : 'No tasks yet'}
      </h3>
      <p className="text-slate-500 text-sm mt-1 max-w-sm">
        {hasTasks
          ? 'Try adjusting your search or filters.'
          : 'Create your first task to get started.'}
      </p>
      {!hasTasks && (
        <button onClick={onAdd} className="btn-primary mt-4">
          <Plus className="w-4 h-4" /> Create your first task
        </button>
      )}
    </div>
  )
}
