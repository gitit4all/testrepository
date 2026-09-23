import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { House, Info, ListTodo, Menu, MessageSquareText, Sparkles, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Start", icon: House, end: true },
  { to: "/begruessung", label: "Beispiel 1: Begrüßung", icon: MessageSquareText },
  { to: "/aufgaben", label: "Beispiel 2: Aufgaben", icon: ListTodo },
  { to: "/ueber", label: "Über", icon: Info },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Mobiles Menü nach Navigation schließen
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <div className="flex h-full">
      {/* Hintergrund-Deko */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-fuchsia-600/25 blur-3xl" />
        <div className="absolute top-1/2 -right-40 h-[28rem] w-[28rem] rounded-full bg-indigo-600/25 blur-3xl" />
      </div>

      {open && (
        <button
          aria-label="Menü schließen"
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-slate-900/80 p-5 backdrop-blur-xl transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="h-6 w-6 text-fuchsia-400 animate-pulse" />
            <span className="bg-gradient-to-r from-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              Hello World Studio
            </span>
          </div>
          <button className="rounded-lg p-1 hover:bg-white/10 md:hidden" onClick={() => setOpen(false)} aria-label="Menü schließen">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-gradient-to-r from-fuchsia-500/20 to-indigo-500/20 text-white ring-1 ring-fuchsia-400/40"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-5 w-5 ${isActive ? "text-fuchsia-400" : ""}`} />
                  {label}
                  {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-fuchsia-400 animate-blink" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <p className="mt-auto text-xs text-slate-500">React · Vite · Tailwind CSS</p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3 md:hidden">
          <button className="rounded-lg p-1.5 hover:bg-white/10" onClick={() => setOpen(true)} aria-label="Menü öffnen">
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-semibold">Hello World Studio</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="mx-auto max-w-3xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
