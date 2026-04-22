import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { loginUser } from "../services/api.js"
import { useAuth } from "../context/AuthContext.jsx"
import finnovaLogo from "../assets/finnova-logo.svg"

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
    <div className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center bg-[#0b1220] overflow-x-hidden">
      {/* Left Side - Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen flex-col items-center justify-center p-12 overflow-hidden bg-slate-900 border-r border-white/5">
        <div className="relative z-10 max-w-lg text-left w-full pl-8">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
            Take control of your money
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Upload your bank statement and instantly understand your spending, income, and habits.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-12 min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm relative z-10 flex flex-col justify-center"
        >
          <div className="mb-10 text-center lg:text-left flex flex-col items-center lg:items-start">
            <img src={finnovaLogo} alt="Finnova" className="h-14 w-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-400 text-sm">
              Money, understood.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3.5 text-sm text-white outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3.5 text-sm text-white outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400 text-center font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login to Account"}
          </button>

          <p className="mt-8 text-sm text-center text-slate-400">
            No account?{" "}
            <Link to="/signup" className="font-semibold text-white hover:text-indigo-400 transition-colors">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
