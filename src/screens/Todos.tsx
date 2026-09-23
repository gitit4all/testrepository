import { useEffect, useState, type FormEvent } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import Card from "../components/Card";

type Todo = { id: string; text: string; done: boolean };
const KEY = "hello-world-studio.todos";

function load(): Todo[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "") as Todo[];
  } catch {
    return [
      { id: "1", text: "GitHub Pages über gh-pages deployen", done: true },
      { id: "2", text: "Eine neue Aufgabe eingeben", done: false },
    ];
  }
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>(load);
  const [text, setText] = useState("");
  const [fresh, setFresh] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(todos));
    } catch {
      /* Speicher nicht verfügbar – ignorieren */
    }
  }, [todos]);

  const add = (e: FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    const id = crypto.randomUUID();
    setTodos((list) => [{ id, text: t, done: false }, ...list]);
    setFresh(id);
    setText("");
  };

  const open = todos.filter((t) => !t.done).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Beispiel 2: Aufgaben</h1>
        <p className="mt-1 text-slate-400">
          Neue Aufgaben blinken kurz auf. Noch offen:{" "}
          <span className={`font-semibold text-fuchsia-300 ${open > 0 ? "animate-blink" : ""}`}>{open}</span>
        </p>
      </header>

      <Card>
        <form onSubmit={add} className="flex gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Was ist zu tun?"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-500/20"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 font-medium shadow-lg shadow-fuchsia-500/20 transition hover:brightness-110 disabled:opacity-40"
          >
            <Plus className="h-5 w-5" /> <span className="hidden sm:inline">Hinzufügen</span>
          </button>
        </form>

        <ul className="mt-6 space-y-2">
          {todos.length === 0 && <li className="py-6 text-center text-slate-500">Alles erledigt 🎉</li>}
          {todos.map((t) => (
            <li
              key={t.id}
              onAnimationEnd={() => t.id === fresh && setFresh(null)}
              className={`group flex items-center gap-3 rounded-xl border border-white/5 bg-slate-900/50 px-4 py-3 ${
                t.id === fresh ? "animate-flash" : ""
              }`}
            >
              <button
                onClick={() => setTodos((l) => l.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                aria-label={t.done ? "Als offen markieren" : "Als erledigt markieren"}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
                  t.done ? "border-fuchsia-400 bg-fuchsia-500" : "border-slate-600 hover:border-fuchsia-400"
                }`}
              >
                {t.done && <Check className="h-4 w-4" />}
              </button>
              <span className={`flex-1 ${t.done ? "text-slate-500 line-through" : ""}`}>{t.text}</span>
              <button
                onClick={() => setTodos((l) => l.filter((x) => x.id !== t.id))}
                aria-label="Löschen"
                className="rounded-lg p-1.5 text-slate-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100 focus:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
