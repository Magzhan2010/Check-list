import { ListTodo, CheckCircle2, CircleDashed, TrendingUp } from 'lucide-react'

export default function StatsOverview({ stats }) {
  const {
    total_tasks = 0,
    completed_tasks = 0,
    remaining_tasks = 0,
    completion_rate = 0,
  } = stats || {}

  const cards = [
    { label: 'Total Tasks', value: total_tasks, icon: ListTodo, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Completed', value: completed_tasks, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Remaining', value: remaining_tasks, icon: CircleDashed, color: 'text-amber-600 bg-amber-50' },
    { label: 'Completion Rate', value: `${completion_rate.toFixed(1)}%`, icon: TrendingUp, color: 'text-pink-600 bg-pink-50' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <div key={c.label} className="card p-4">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center ${c.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tabular-nums">{c.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{c.label}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
