import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { loginUser } from "../services/api.js"
import { useAuth } from "../context/AuthContext.jsx"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, token } = useAuth()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      const data = await loginUser(form)
      login(data.token, data.user)

      const redirectTo = location.state?.from?.pathname || "/dashboard"
      navigate(redirectTo, { replace: true })
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gradient-to-b from-[#0b1220] to-[#111827]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl p-8 bg-slate-800/90 border border-white/10 shadow-2xl backdrop-blur"
      >
        <h1 className="text-xl font-semibold text-center text-white">
          Bank Statement Analyzer
        </h1>
        <p className="text-sm text-center text-slate-400 mt-1">
          Log in to access your dashboards
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-200">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
            />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 rounded-lg text-sm font-semibold bg-indigo-600 text-white transition-all duration-200 hover:bg-indigo-700 hover:opacity-80 disabled:bg-slate-700 disabled:text-slate-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-sm text-center text-slate-400">
          No account?{" "}
          <Link to="/signup" className="font-medium text-indigo-300 transition-all duration-200 hover:text-indigo-200 hover:opacity-80">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
