import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { isAuthenticated, registerUser } from '../services/authService'

// Register page component: creates a new user account through DummyJSON.
export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()
  const [serverMessage, setServerMessage] = useState('')
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  // Redirect already-authenticated users to the dashboard.
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  // Handle registration form submit and show success/error feedback.
  async function onSubmit(values) {
    setServerError('')
    setServerMessage('')

    try {
      const user = await registerUser(values)
      setServerMessage(`Account created for ${user.username}. You can now sign in.`)
      setTimeout(() => navigate('/login'), 1800)
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Unable to create account. Please try again.'
      setServerError(message)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <section className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-10">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/90">Create your account</p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Join the team</h1>
          <p className="text-slate-400">Register quickly and access the product management dashboard.</p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              <span>First name</span>
              <input
                type="text"
                placeholder="First name"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                {...register('firstName', { required: 'First name is required' })}
              />
              {errors.firstName && <p className="text-sm text-rose-400">{errors.firstName.message}</p>}
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Last name</span>
              <input
                type="text"
                placeholder="Last name"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                {...register('lastName', { required: 'Last name is required' })}
              />
              {errors.lastName && <p className="text-sm text-rose-400">{errors.lastName.message}</p>}
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && <p className="text-sm text-rose-400">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && <p className="text-sm text-rose-400">{errors.email.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              <span>Age</span>
              <input
                type="number"
                min="13"
                placeholder="Age"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                {...register('age', {
                  required: 'Age is required',
                  min: { value: 13, message: 'You must be at least 13' },
                })}
              />
              {errors.age && <p className="text-sm text-rose-400">{errors.age.message}</p>}
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Password</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create password"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 pr-12 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must have at least 6 characters' } })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full px-2 py-1 text-slate-400 transition hover:text-cyan-300"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="text-sm text-rose-400">{errors.password.message}</p>}
            </label>
          </div>

          {serverError && <div className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300 ring-1 ring-rose-500/20">{serverError}</div>}
          {serverMessage && <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 ring-1 ring-emerald-500/20">{serverMessage}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between text-sm text-slate-400">
          <p>Already have an account?</p>
          <Link to="/login" className="font-semibold cursor-pointer text-cyan-300 transition hover:text-cyan-100">
            Sign in
          </Link>
        </div>
      </section>
    </main>
  )
}
