import { Link } from "react-router-dom";
import { ArrowRight, ListTodo, MessageSquareText } from "lucide-react";
import Card from "../components/Card";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="pt-8 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">
          <span className="animate-gradient bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400 bg-[length:200%_200%] bg-clip-text text-transparent">
            Hello, World!
          </span>
          <span className="ml-1 inline-block h-[0.9em] w-[0.12em] translate-y-[0.1em] bg-fuchsia-400 animate-blink" />
        </h1>
        <p className="mt-6 text-lg text-slate-400">
          Eine kleine Demo mit <span className="font-semibold text-fuchsia-300 animate-pulse-glow">blinkenden</span> Effekten,
          Eingabefeldern und einem Seitenmenü.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Example
          to="/begruessung"
          icon={<MessageSquareText className="h-6 w-6" />}
          title="Beispiel 1: Begrüßung"
          text="Namen eingeben und eine Schreibmaschinen-Begrüßung mit blinkendem Cursor erleben."
        />
        <Example
          to="/aufgaben"
          icon={<ListTodo className="h-6 w-6" />}
          title="Beispiel 2: Aufgaben"
          text="Eine kleine Aufgabenliste – neue Einträge blinken kurz auf und bleiben gespeichert."
        />
      </div>
    </div>
  );
}

function Example({ to, icon, title, text }: { to: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Link to={to} className="group">
      <Card className="h-full transition group-hover:-translate-y-1 group-hover:border-fuchsia-400/40">
        <div className="mb-4 inline-flex rounded-xl bg-fuchsia-500/15 p-3 text-fuchsia-300">{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-slate-400">{text}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-fuchsia-300">
          Ausprobieren <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </Card>
    </Link>
  );
}
