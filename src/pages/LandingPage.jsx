import { Link } from 'react-router-dom'
import { CheckCircle2, Users, ListTodo, BarChart3, Zap, Shield } from 'lucide-react'

const features = [
  { icon: ListTodo, title: 'Simple Task Management', description: 'Create, edit, and organize tasks effortlessly.' },
  { icon: Users, title: 'Built for Small Teams', description: 'Perfect for freelancers and small teams who need clarity.' },
  { icon: BarChart3, title: 'Track Your Progress', description: 'Move tasks between lists and mark them complete.' },
  { icon: Zap, title: 'Fast & Lightweight', description: 'Sign up and start managing your tasks in seconds.' },
  { icon: Shield, title: 'Secure & Private', description: 'Your tasks stay private. Access only what\'s yours.' },
  { icon: CheckCircle2, title: 'Stay on Top of Work', description: 'A clear workflow keeps you focused on what matters most.' },
]

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="text-lg font-bold text-gray-800">TaskSphere</span>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-2xl mx-auto text-center px-6 pt-20 pb-16">
        <h1 className="text-4xl font-bold text-gray-800">
          Task management, <span className="text-emerald-600">simplified.</span>
        </h1>
        <p className="mt-4 text-gray-500">
          TaskSphere helps you organize, track, and manage daily tasks — without the clutter.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/register" className="px-6 py-2 bg-emerald-600 text-white text-sm font-medium rounded hover:bg-emerald-700">
            Create an Account
          </Link>
          <Link to="/login" className="px-6 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-100">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-gray-200 rounded-lg p-5">
              <f.icon className="h-5 w-5 text-emerald-600 mb-2" />
              <h3 className="text-sm font-semibold text-gray-800">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} TaskSphere. All rights reserved.
      </footer>
    </div>
  )
}

export default LandingPage
