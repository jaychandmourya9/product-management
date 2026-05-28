import { Link, useNavigate } from 'react-router-dom'
import { clearAuth, getUser } from '../services/authService'

// Dashboard page component: displays user info and navigation actions.
export default function Dashboard() {
  const navigate = useNavigate()
  const user = getUser()

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <section className="mx-auto max-w-4xl rounded-[32px] border border-slate-800 bg-slate-900/85 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/90">Dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Welcome back, {user?.firstName || user?.username || 'user'}.</h1>
            <p className="mt-4 max-w-2xl text-slate-400">
              You are signed in and ready to manage your product lifecycle. Keep your workspace secure by logging out when you’re done.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <Link
              to="/products"
              className="inline-flex cursor-pointer rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              View products
            </Link>
            <button
              type="button"
              onClick={() => {
                clearAuth()
                navigate('/login')
              }}
              className="cursor-pointer rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <article className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-slate-300 shadow-xl shadow-slate-950/10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400/90">Secure token</p>
            <p className="mt-3 text-lg text-slate-100">Your JWT is stored locally so your session stays active until you log out.</p>
          </article>

          <article className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-slate-300 shadow-xl shadow-slate-950/10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400/90">Easy access</p>
            <p className="mt-3 text-lg text-slate-100">Use the login and register pages to authenticate through DummyJSON and return here for protected content.</p>
          </article>
        </div>
      </section>
    </main>
  )
}
