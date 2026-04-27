import { useApiStatus } from "../context/ApiStatusContext.jsx"

export default function WakingUpOverlay() {
  const { isWakingUp, hasWokenUp } = useApiStatus()

  if (!isWakingUp || hasWokenUp) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/72 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/95 p-8 text-center shadow-2xl shadow-black/35">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-400/10">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-300/30 border-t-indigo-300" />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-white">
          Waking up server, please wait...
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          This may take up to 30 seconds
        </p>
      </div>
    </div>
  )
}
