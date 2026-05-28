import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { isAuthenticated, loginUser, saveAuthToken, saveUser } from '../services/authService'

// Login page component: authenticates the user and redirects to the dashboard.
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  // Redirect authenticated users away from the login page.
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  // Submit login form and store auth token/user details locally.
  async function onSubmit(values) {
    setServerError('')

    try {
      const data = await loginUser(values)
      saveAuthToken(data.token)
      saveUser(data)
      navigate('/dashboard')
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Unable to sign in. Please try again.'
      setServerError(message)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <section className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-10">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/90">Product Management</p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Welcome back</h1>
          <p className="text-slate-400">Sign in with your credentials to manage products and access your dashboard.</p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && <p className="text-sm text-rose-400">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 pr-12 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-slate-400 transition hover:text-cyan-300"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <p className="text-sm text-rose-400">{errors.password.message}</p>}
          </div>

          {serverError && <div className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300 ring-1 ring-rose-500/20">{serverError}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between text-sm text-slate-400">
          <p>New here?</p>
          <Link to="/register" className="font-semibold cursor-pointer text-cyan-300 transition hover:text-cyan-100">
            Create account
          </Link>
        </div>

        <div className="mt-8 rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-400 ring-1 ring-slate-700">
          <p className="font-semibold text-slate-200">Quick test credentials</p>
          <p>Username: <span className="text-cyan-300">emilys</span></p>
          <p>Password: <span className="text-cyan-300">emilyspass</span></p>
        </div>
      </section>
    </main>
  )
}
