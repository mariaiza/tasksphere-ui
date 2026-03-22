import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTask, getTasks, updateTask, updateTaskStatus } from '../services/api'
import { LogOut, Plus, Loader2, ClipboardList, Pencil, X, Check } from 'lucide-react'

const STATUS_CYCLE = ['todo', 'in_progress', 'completed']

const STATUS_BADGE = {
  todo:        'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  completed:   'bg-emerald-100 text-emerald-700',
}

const STATUS_LABEL = {
  todo:        'To Do',
  in_progress: 'In Progress',
  completed:   'Completed',
}

const STATUS_EMOJI = {
  todo:        '⬜',
  in_progress: '⏳',
  completed:   '✅',
}

function TasksPage() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [form, setForm] = useState({ title: '', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [confirmation, setConfirmation] = useState('')

  // Edit state
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '' })
  const [editError, setEditError] = useState('')
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
      return
    }
    getTasks()
      .then((res) => setTasks(res.data?.results ?? res.data ?? []))
      .catch(() => setTasks([]))
      .finally(() => setTasksLoading(false))
  }, [navigate])

  const showConfirmation = (msg) => {
    setConfirmation(msg)
    setTimeout(() => setConfirmation(''), 2500)
  }

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
      showConfirmation('Task created.')
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

  const handleToggleStatus = async (task) => {
    const nextStatus = STATUS_CYCLE[(STATUS_CYCLE.indexOf(task.status) + 1) % STATUS_CYCLE.length]
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: nextStatus } : t))
    try {
      await updateTaskStatus(task.id, nextStatus)
    } catch {
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: task.status } : t))
    }
  }

  const handleEditOpen = (task) => {
    setEditId(task.id)
    setEditForm({ title: task.title, description: task.description ?? '' })
    setEditError('')
  }

  const handleEditCancel = () => {
    setEditId(null)
    setEditError('')
  }

  const handleEditSave = async (taskId) => {
    if (!editForm.title.trim()) {
      setEditError('Title is required.')
      return
    }
    setEditLoading(true)
    try {
      const res = await updateTask(taskId, { title: editForm.title.trim(), description: editForm.description.trim() })
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, ...res.data } : t))
      setEditId(null)
    } catch {
      setEditError('Failed to save changes.')
    } finally {
      setEditLoading(false)
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
        {/* Confirmation toast */}
        {confirmation && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded px-4 py-2">
            {confirmation}
          </div>
        )}

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
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            My Tasks {!tasksLoading && <span className="text-gray-400 font-normal normal-case">({tasks.length})</span>}
          </h2>

          {tasksLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No tasks yet. Create one above.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                  {editId === task.id ? (
                    /* Inline edit form */
                    <div className="space-y-3">
                      {editError && (
                        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{editError}</p>
                      )}
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={2}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                        placeholder="Description (optional)"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSave(task.id)}
                          disabled={editLoading}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700 disabled:opacity-60"
                        >
                          {editLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-600 text-xs rounded hover:bg-gray-50"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal task row */
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(task)}
                        title="Click to cycle status"
                        className="shrink-0 text-lg hover:scale-110 transition-transform mt-0.5"
                      >
                        {STATUS_EMOJI[task.status] ?? '⬜'}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                        )}
                      </div>
                      <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${STATUS_BADGE[task.status] ?? STATUS_BADGE.todo}`}>
                        {STATUS_LABEL[task.status] ?? task.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleEditOpen(task)}
                        className="shrink-0 text-gray-400 hover:text-emerald-600 transition-colors"
                        title="Edit task"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
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
