import { useEffect, useState } from "react";
import Card from "../components/Card";

type Style = "cursor" | "glow" | "none";

export default function Greeting() {
  const [name, setName] = useState("");
  const [speed, setSpeed] = useState(60);
  const [style, setStyle] = useState<Style>("cursor");
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

        <div className="grid gap-5 sm:grid-cols-2">
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
          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Blink-Effekt</span>
            <div className="inline-flex rounded-xl bg-uos-gray-light p-1 ring-1 ring-slate-200">
              {(["cursor", "glow", "none"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    style === s ? "bg-uos-red text-white shadow-sm" : "text-slate-600 hover:text-uos-red"
                  }`}
                >
                  {{ cursor: "Cursor", glow: "Leuchten", none: "Aus" }[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="flex min-h-40 items-center justify-center">
        <p
          className={`text-center font-mono text-3xl text-slate-800 font-bold md:text-5xl ${style === "glow" ? "animate-pulse-glow text-uos-red" : ""}`}
          aria-live="polite"
        >
          {typed}
          {style === "cursor" && <span className="ml-1 text-uos-red animate-blink">▌</span>}
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
