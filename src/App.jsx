import { useState, useEffect, useCallback, useMemo } from 'react'
import { RefreshCw, Plus, Search } from 'lucide-react'

import { api, ApiError } from './api/tasks'
import { useToast } from './hooks/useToast'

import Header from './components/Header'
import StatsOverview from './components/StatsOverview'
import ProductiveDayBanner from './components/ProductiveDayBanner'
import ChartsSection from './components/ChartsSection'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import EditTaskModal from './components/EditTaskModal'
import ToastContainer from './components/ToastContainer'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import EmptyState from './components/EmptyState'
import LoadingState from './components/LoadingState'
import ApiErrorBanner from './components/ApiErrorBanner'

export default function App() {
  const { toasts, toast } = useToast()

  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState(null)
  const [categoryStats, setCategoryStats] = useState([])

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [apiError, setApiError] = useState(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deletingTask, setDeletingTask] = useState(null)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const loadAll = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true)
      setRefreshing(true)
      setApiError(null)
      try {
        const [taskList, statsData, catData] = await Promise.all([
          api.listTasks(),
          api.getStatistics().catch(() => null),
          api.getCategoryStats().catch(() => []),
        ])
        setTasks(Array.isArray(taskList) ? taskList : [])
        if (statsData) setStats(statsData)
        setCategoryStats(Array.isArray(catData) ? catData : [])
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? err.status === 0
              ? `Cannot reach API at ${import.meta.env.VITE_API_URL || 'http://localhost:8000'}. Is your FastAPI server running and CORS enabled?`
              : `API error: ${err.message}`
            : `Unexpected error: ${err.message}`
        setApiError(msg)
        if (!silent) toast.error(msg, { title: 'Connection problem' })
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [toast],
  )

  useEffect(() => {
    loadAll()
  }, [])

  const handleCreate = async (payload) => {
    try {
      await api.createTask(payload)
      toast.success('Task created')
      setIsFormOpen(false)
      await loadAll(true)
    } catch (err) {
      toast.error(err.message || 'Failed to create task')
      throw err
    }
  }

  const handleUpdate = async (id, payload) => {
    try {
      await api.updateTask(id, payload)
      toast.success('Task updated')
      setEditingTask(null)
      await loadAll(true)
    } catch (err) {
      toast.error(err.message || 'Failed to update task')
      throw err
    }
  }

  const handleToggleComplete = async (task) => {
    const prev = tasks
    setTasks((ts) =>
      ts.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)),
    )
    try {
      await api.toggleComplete(task.id, !task.completed)
      await loadAll(true)
    } catch (err) {
      setTasks(prev)
      toast.error(err.message || 'Failed to update task')
    }
  }

  const handleDelete = async (task) => {
    try {
      await api.deleteTask(task.id)
      toast.success('Task deleted')
      setDeletingTask(null)
      await loadAll(true)
    } catch (err) {
      toast.error(err.message || 'Failed to delete task')
    }
  }

  const effectiveStats = useMemo(() => {
    if (stats) return stats
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    return {
      total_tasks: total,
      completed_tasks: completed,
      remaining_tasks: total - completed,
      completion_rate: total === 0 ? 0 : (completed / total) * 100,
    }
  }, [stats, tasks])

  const effectiveCategoryStats = useMemo(() => {
    if (categoryStats.length > 0) return categoryStats
    const map = {}
    for (const t of tasks) {
      const c = t.category || 'Uncategorized'
      map[c] = (map[c] || 0) + 1
    }
    return Object.entries(map).map(([category, total]) => ({ category, total }))
  }, [categoryStats, tasks])

  const visibleTasks = useMemo(() => {
    let list = [...tasks]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (t) =>
          (t.title || '').toLowerCase().includes(q) ||
          (t.category || '').toLowerCase().includes(q),
      )
    }
    if (filterStatus === 'pending') list = list.filter((t) => !t.completed)
    if (filterStatus === 'completed') list = list.filter((t) => t.completed)
    if (filterPriority !== 'all')
      list = list.filter((t) => t.priority === filterPriority)

    const priorityRank = { High: 0, Medium: 1, Low: 2 }
    list.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0)
      if (sortBy === 'oldest') return new Date(a.created_at || 0) - new Date(b.created_at || 0)
      if (sortBy === 'priority') return (priorityRank[a.priority] ?? 3) - (priorityRank[b.priority] ?? 3)
      return 0
    })
    return list
  }, [tasks, search, filterStatus, filterPriority, sortBy])

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header onRefresh={() => loadAll(true)} refreshing={refreshing} />

        {apiError && !loading && (
          <ApiErrorBanner
            message={apiError}
            onRetry={() => loadAll(false)}
            onDismiss={() => setApiError(null)}
          />
        )}

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Overview</h2>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card h-28 animate-pulse bg-slate-100" />
              ))}
            </div>
          ) : (
            <StatsOverview stats={effectiveStats} />
          )}
        </section>

        <section className="mt-6">
          {!loading && <ProductiveDayBanner stats={effectiveStats} />}
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Analytics</h2>
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card h-72 animate-pulse bg-slate-100" />
              ))}
            </div>
          ) : (
            <ChartsSection
              stats={effectiveStats}
              categoryStats={effectiveCategoryStats}
              tasks={tasks}
            />
          )}
        </section>

        <section className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">CheckList</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {tasks.length} total · {completedCount} completed ·{' '}
                {tasks.length - completedCount} pending
              </p>
            </div>
            <button onClick={() => setIsFormOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>

          <div className="card p-3 mb-4 flex flex-col lg:flex-row gap-2 lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or category..."
                className="input pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterSelect value={filterStatus} onChange={setFilterStatus}
                options={[
                  { value: 'all', label: 'All status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'completed', label: 'Completed' },
                ]}
              />
              <FilterSelect value={filterPriority} onChange={setFilterPriority}
                options={[
                  { value: 'all', label: 'All priority' },
                  { value: 'High', label: 'High' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'Low', label: 'Low' },
                ]}
              />
              <FilterSelect value={sortBy} onChange={setSortBy}
                options={[
                  { value: 'newest', label: 'Newest' },
                  { value: 'oldest', label: 'Oldest' },
                  { value: 'priority', label: 'By priority' },
                ]}
              />
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : visibleTasks.length === 0 ? (
            <EmptyState hasTasks={tasks.length > 0} onAdd={() => setIsFormOpen(true)} />
          ) : (
            <TaskList
              tasks={visibleTasks}
              onToggle={handleToggleComplete}
              onEdit={(t) => setEditingTask(t)}
              onDelete={(t) => setDeletingTask(t)}
            />
          )}
        </section>

        <footer className="mt-12 pb-6 text-center text-slate-400 text-sm">
          Built with React · TailwindCSS · Recharts
        </footer>
      </div>

      <button
        onClick={() => loadAll(true)}
        disabled={refreshing}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-white border border-slate-300 shadow-md hover:bg-slate-50 flex items-center justify-center disabled:opacity-50"
        title="Refresh"
      >
        <RefreshCw className={`w-4 h-4 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
      </button>

      {isFormOpen && (
        <TaskForm onClose={() => setIsFormOpen(false)} onSubmit={handleCreate} />
      )}
      {editingTask && (
        <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)}
          onSubmit={(payload) => handleUpdate(editingTask.id, payload)} />
      )}
      {deletingTask && (
        <DeleteConfirmModal task={deletingTask}
          onCancel={() => setDeletingTask(null)}
          onConfirm={() => handleDelete(deletingTask)} />
      )}

      <ToastContainer toasts={toasts} onDismiss={toast.dismiss} />
    </div>
  )
}

function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input py-1.5 px-3 text-sm cursor-pointer min-w-[120px]"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
