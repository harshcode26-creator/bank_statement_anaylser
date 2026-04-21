export default function DashboardHeader({ title = "Dashboard", onToggle }) {
  return (
    <header
      className="hidden lg:flex h-16 items-center
           border-b bg-white px-6"
    >
      <button
        className="p-2 rounded hover:bg-gray-100 lg:hidden"
        onClick={onToggle}
      >
        &#9776;
      </button>

      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    </header>
  )
}
