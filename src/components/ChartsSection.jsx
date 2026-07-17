import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadialBarChart, RadialBar,
} from 'recharts'
import { PRIORITY_META } from '../api/tasks'

const CATEGORY_PALETTE = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#eab308']

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="card p-4">
      <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mb-3">{subtitle}</p>}
      <div className="h-64 mt-2">{children}</div>
    </div>
  )
}

function LightTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-md px-3 py-2 text-xs">
      {label && <p className="text-slate-700 font-medium mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 text-slate-600">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.payload?.fill }} />
          <span className="capitalize">{p.name}:</span>
          <span className="font-semibold text-slate-800">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function ChartsSection({ stats, categoryStats, tasks }) {
  const categoryData = (categoryStats || [])
    .filter((c) => c && c.category)
    .map((c, i) => ({
      name: c.category,
      value: Number(c.total) || 0,
      color: CATEGORY_PALETTE[i % CATEGORY_PALETTE.length],
    }))

  const priorityCounts = { Low: 0, Medium: 0, High: 0 }
  for (const t of tasks || []) {
    if (t.priority && priorityCounts[t.priority] !== undefined) priorityCounts[t.priority] += 1
  }
  const priorityData = ['High', 'Medium', 'Low'].map((p) => ({
    name: p,
    value: priorityCounts[p],
    fill: PRIORITY_META[p]?.color || '#6366f1',
  }))

  const rate = Math.round(stats?.completion_rate || 0)
  const radialData = [{ name: 'Completed', value: rate, fill: '#6366f1' }]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <ChartCard title="Category Distribution" subtitle="Tasks grouped by category">
        {categoryData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">No categories yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<LightTooltip />} />
              <Legend iconType="circle" layout="vertical" align="right" verticalAlign="middle"
                wrapperStyle={{ fontSize: 12, color: '#475569' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Priority Breakdown" subtitle="Tasks by priority level">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip cursor={{ fill: '#f1f5f9' }} content={<LightTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {priorityData.map((p, i) => (
                <Cell key={i} fill={p.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Completion Rate" subtitle="Overall progress">
        <div className="relative h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="100%"
              data={radialData} startAngle={90} endAngle={90 - (rate * 360) / 100}>
              <RadialBar background={{ fill: '#f1f5f9' }} dataKey="value" cornerRadius={15} fill="#6366f1" />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-bold text-slate-900 tabular-nums">{rate}%</span>
            <span className="text-xs text-slate-500 mt-1">
              {stats?.completed_tasks || 0} of {stats?.total_tasks || 0} done
            </span>
          </div>
        </div>
      </ChartCard>
    </div>
  )
}
