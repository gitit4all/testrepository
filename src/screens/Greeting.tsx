import { useEffect, useState } from "react";
import Card from "../components/Card";

export default function Greeting() {
  const [name, setName] = useState("");
  const [speed, setSpeed] = useState(60);
  const target = `Hallo, ${name.trim() || "Welt"}!`;
  const typed = useTypewriter(target, speed);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Beispiel 1: Begrüßung</h1>
        <p className="mt-1 text-slate-600">Gib deinen Namen ein – die Begrüßung tippt sich selbst.</p>
      </header>

      <Card className="space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Dein Name</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Ada Lovelace"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg outline-none transition placeholder:text-slate-400 focus:border-uos-red focus:ring-4 focus:ring-uos-red/15"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Tippgeschwindigkeit: {speed} ms</span>
          <input
            type="range"
            min={20}
            max={200}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-uos-red"
          />
        </label>
      </Card>

      <Card className="flex min-h-40 items-center justify-center">
        <p
          className="text-center font-mono text-3xl text-slate-800 font-bold md:text-5xl"
          aria-live="polite"
        >
          {typed}
        </p>
      </Card>
    </div>
  );
}

/** Tippt `text` Zeichen für Zeichen; bei Änderungen wird vom gemeinsamen Präfix aus weitergetippt. */
function useTypewriter(text: string, speed: number) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setShown((cur) => {
        if (cur === text) return cur;
        if (!text.startsWith(cur)) return cur.slice(0, -1); // zurücklöschen
        return text.slice(0, cur.length + 1);
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return shown;
}
