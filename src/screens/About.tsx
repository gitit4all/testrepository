import Card from "../components/Card";

const STACK = [
  ["React 19", "UI-Komponenten und State"],
  ["React Router", "Screens im Seitenmenü (Hash-Routing für GitHub Pages)"],
  ["Tailwind CSS 4", "Styling und Blink-Animationen"],
  ["Vite", "Dev-Server und Build"],
  ["Lucide", "Icons"],
  ["GitHub Actions", "Build und Deployment in den Branch gh-pages"],
];

export default function About() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Über dieses Projekt</h1>
        <p className="mt-1 text-slate-600">Womit diese Seite gebaut ist.</p>
      </header>
      <Card>
        <dl className="divide-y divide-slate-100">
          {STACK.map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
              <dt className="w-40 shrink-0 font-semibold text-uos-red">{name}</dt>
              <dd className="text-slate-600">{desc}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
