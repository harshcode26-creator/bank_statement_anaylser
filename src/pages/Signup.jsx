import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { signupUser } from "../services/api.js"
import { useAuth } from "../context/AuthContext.jsx"

export default function Signup() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
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
      await signupUser(form)
      navigate("/login", { replace: true })
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center bg-[#0b1220] overflow-x-hidden">
      {/* Left Side - Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-blue-600/20 z-0"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] z-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] z-0"></div>
        
        <div className="relative z-10 text-center">
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Smart Finance <br /> 
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Tracking
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
            Analyze your bank statements with AI and track your spending effortlessly. 
            Join thousands of users managing their wealth smarter.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-12 relative min-h-screen">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create your account
            </h1>
            <p className="text-slate-400">
              Start tracking your finances smarter
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
              />
            </div>

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
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
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
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400 text-center font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Get Started Now"}
          </button>

          <p className="mt-8 text-sm text-center text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Log in here
            </Link>
          </p>

          <div className="mt-12 flex items-center justify-center gap-2 text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs font-medium">Your data is secure and encrypted</span>
          </div>
        </form>
      </div>
    </div>
  )
}
