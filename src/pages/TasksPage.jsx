import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTask, getTasks } from '../services/api'
import { LogOut, Plus, Loader2 } from 'lucide-react'

function TasksPage() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState({ title: '', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
      return
    }
    getTasks()
      .then((res) => setTasks(res.data?.results ?? res.data ?? []))
      .catch(() => setTasks([]))
  }, [navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    setLoading(true)
    try {
      const res = await createTask(form.title.trim(), form.description.trim())
      setTasks((prev) => [res.data, ...prev])
      setForm({ title: '', description: '' })
      setShowForm(false)
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        const first = Object.values(data).flat()[0]
        setError(typeof first === 'string' ? first : 'Failed to create task.')
      } else {
        setError('Failed to create task.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="text-lg font-bold text-gray-800">TaskSphere</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* New Task Button / Form */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Create Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {error}
                </p>
              )}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder="Add details…"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-600 text-white text-sm font-medium py-2 rounded hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError('') }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">My Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No tasks yet. Create one above.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <p className="text-sm font-medium text-gray-800">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}

export default TasksPage
