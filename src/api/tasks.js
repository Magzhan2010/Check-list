// API client for the FastAPI task backend.
// Matches a backend where the PUT route is /tasks/{id} (typo fixed).

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  let res
  try {
    res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })
  } catch (err) {
    throw new ApiError(`Network error: ${err.message}`, 0, err)
  }

  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const data = await res.json()
      detail = data.detail || detail
    } catch (_) {
      /* ignore */
    }
    throw new ApiError(detail, res.status)
  }

  if (res.status === 204) return null

  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch (_) {
    return text
  }
}

export class ApiError extends Error {
  constructor(message, status, cause) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    if (cause) this.cause = cause
  }
}

// ----- Task endpoints -----
export const api = {
  listTasks: () => request('/tasks'),

  getTask: (id) => request(`/tasks/${id}`),

  createTask: (payload) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateTask: (id, payload) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  toggleComplete: (id, completed) =>
    request(`/tasks/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    }),

  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: 'DELETE',
    }),

  getStatistics: () => request('/statistics'),

  getCategoryStats: () => request('/statistics/category'),
}

export const PRIORITIES = ['Low', 'Medium', 'High']

export const PRIORITY_META = {
  Low: {
    label: 'Low',
    color: '#10b981',
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
  },
  Medium: {
    label: 'Medium',
    color: '#f59e0b',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-300',
  },
  High: {
    label: 'High',
    color: '#ef4444',
    bg: 'bg-rose-100',
    text: 'text-rose-700',
    border: 'border-rose-300',
  },
}
