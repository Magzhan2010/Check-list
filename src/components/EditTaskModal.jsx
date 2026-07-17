import { useState, useEffect } from 'react'
import { X, Save, Loader2, AlertCircle } from 'lucide-react'
import { PRIORITIES, PRIORITY_META } from '../api/tasks'
import { Backdrop } from './TaskForm'

export default function EditTaskModal({ task, onClose, onSubmit }) {
  const [title, setTitle] = useState(task.title || '')
  const [category, setCategory] = useState(task.category || '')
  const [priority, setPriority] = useState(task.priority || 'Medium')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (title.trim().length < 10) return setError('Title must be at least 10 characters.')
    if (!category.trim()) return setError('Category is required.')
    setSubmitting(true)
    try {
      await onSubmit({ title: title.trim(), category: category.trim(), priority })
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Backdrop onClose={onClose}>
      <form onSubmit={handleSubmit} className="card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">Edit task</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title (min 10 chars)</label>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITIES.map((p) => {
                const meta = PRIORITY_META[p]
                const active = priority === p
                return (
                  <button type="button" key={p} onClick={() => setPriority(p)}
                    className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors
                      ${active ? `${meta.bg} ${meta.text} ${meta.border}` : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                    {meta.label}
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <button type="button" onClick={onClose} className="btn-secondary flex-1" disabled={submitting}>Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </form>
    </Backdrop>
  )
}
