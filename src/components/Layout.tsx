import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { House, Info, ListTodo, Menu, MessageSquareText, X, FileText } from "lucide-react";

// Offizielles Logo der Universität Osnabrück (weiß, für roten Hintergrund)
const LOGO = `${import.meta.env.BASE_URL}uos-logo.svg`;

const NAV = [
  { to: "/", label: "Start", icon: House, end: true },
  { to: "/begruessung", label: "Beispiel 1: Begrüßung", icon: MessageSquareText },
  { to: "/aufgaben", label: "Beispiel 2: Aufgaben", icon: ListTodo },
  { to: "/markdown", label: "Markdown-Editor", icon: FileText },
  { to: "/ueber", label: "Über", icon: Info },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Mobiles Menü nach Navigation schließen
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <div className="flex h-full">
      {open && (
        <button
          aria-label="Menü schließen"
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white shadow-sm transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-uos-red px-5 pt-5 pb-4 text-white">
          <div className="flex items-start justify-between gap-2">
            <img src={LOGO} alt="Universität Osnabrück" className="h-10 w-auto" />
            <button className="rounded-lg p-1 hover:bg-white/15 md:hidden" onClick={() => setOpen(false)} aria-label="Menü schließen">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-3 text-sm font-semibold tracking-wide text-white/90">Hello World Studio</p>
        </div>

        <nav className="flex flex-col gap-1 p-5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-uos-red-light text-uos-red ring-1 ring-uos-red/30"
                    : "text-slate-600 hover:bg-uos-gray-light hover:text-uos-red"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-5 w-5 ${isActive ? "text-uos-red" : "text-uos-gray group-hover:text-uos-red"}`} />
                  {label}
                  {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-uos-red" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <p className="mt-auto px-5 pb-5 text-xs text-uos-gray">React · Vite · Tailwind CSS</p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 bg-uos-red px-4 py-3 text-white shadow-sm md:hidden">
          <button className="rounded-lg p-1.5 hover:bg-white/15" onClick={() => setOpen(true)} aria-label="Menü öffnen">
            <Menu className="h-6 w-6" />
          </button>
          <img src={LOGO} alt="Universität Osnabrück" className="h-8 w-auto" />
          <span className="ml-auto text-sm font-semibold">Hello World Studio</span>
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
