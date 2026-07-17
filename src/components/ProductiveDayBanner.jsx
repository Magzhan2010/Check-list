import { Trophy, Flame, Target } from 'lucide-react'

export default function ProductiveDayBanner({ stats }) {
  const { total_tasks = 0, completed_tasks = 0, completion_rate = 0 } = stats || {}
  const rate = completion_rate || 0
  const isProductive = rate >= 50
  const isPerfect = rate === 100 && total_tasks > 0

  if (total_tasks === 0) return null

  let config
  if (isPerfect) {
    config = {
      icon: Trophy,
      title: 'Perfect Day!',
      subtitle: `All ${total_tasks} tasks completed. Great job!`,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconColor: 'text-amber-600 bg-amber-100',
      titleColor: 'text-amber-900',
      textColor: 'text-amber-800',
      barColor: 'bg-amber-500',
    }
  } else if (isProductive) {
    config = {
      icon: Flame,
      title: 'Productive Day Achieved!',
      subtitle: `${completed_tasks} of ${total_tasks} tasks done. You crossed 50%.`,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      iconColor: 'text-emerald-600 bg-emerald-100',
      titleColor: 'text-emerald-900',
      textColor: 'text-emerald-800',
      barColor: 'bg-emerald-500',
    }
  } else {
    const needed = Math.ceil(total_tasks / 2) - completed_tasks
    config = {
      icon: Target,
      title: `${needed} more to a productive day`,
      subtitle: `Complete ${needed} more task${needed === 1 ? '' : 's'} to hit 50%.`,
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      iconColor: 'text-indigo-600 bg-indigo-100',
      titleColor: 'text-indigo-900',
      textColor: 'text-indigo-800',
      barColor: 'bg-indigo-500',
    }
  }

  const Icon = config.icon

  return (
    <div className={`card border ${config.border} ${config.bg} p-4 flex items-center gap-4`}>
      <div className={`w-11 h-11 rounded-md flex items-center justify-center ${config.iconColor} flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold ${config.titleColor}`}>{config.title}</h3>
        <p className={`text-sm ${config.textColor} mt-0.5`}>{config.subtitle}</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full ${config.barColor} rounded-full transition-all duration-700`}
              style={{ width: `${Math.min(rate, 100)}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-600 tabular-nums">
            {Math.round(rate)}%
          </span>
        </div>
      </div>
    </div>
  )
}
