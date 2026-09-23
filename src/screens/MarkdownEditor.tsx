import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import {
  Bold,
  Check,
  Code,
  Columns2,
  Copy,
  Download,
  Eye,
  Heading2,
  Italic,
  Link,
  List,
  ListOrdered,
  PenLine,
  Quote,
  Trash2,
} from "lucide-react";
import Card from "../components/Card";

const KEY = "hello-world-studio.markdown";

const SAMPLE = `# Willkommen im Markdown-Editor

Schreibe links, und rechts erscheint sofort die **Vorschau**. Der Text wird automatisch im Browser gespeichert.

## Formatierung

- **Fett** mit \`Strg+B\`, *kursiv* mit \`Strg+I\`
- [Links](https://www.uni-osnabrueck.de) und \`Inline-Code\`
- Nummerierte Listen:
  1. Erster Schritt
  2. Zweiter Schritt

> Markdown ist eine einfache Auszeichnungssprache – gut lesbar, auch ohne Vorschau.

## Code

\`\`\`ts
function begruessung(name: string) {
  return \`Hallo, \${name}!\`;
}
\`\`\`

## Tabelle

| Werkzeug | Zweck        |
| -------- | ------------ |
| marked   | Parsen       |
| DOMPurify| Absichern    |
`;

type Mode = "editor" | "split" | "preview";

// Externe Links sicher in neuem Tab öffnen
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && /^https?:/i.test(node.getAttribute("href") ?? "")) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
});

function load(): string {
  try {
    return localStorage.getItem(KEY) ?? SAMPLE;
  } catch {
    return SAMPLE;
  }
}

const PROSE = [
  "text-slate-700 leading-relaxed break-words",
  "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
  "[&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:border-b [&_h1]:border-slate-200 [&_h1]:pb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900",
  "[&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900",
  "[&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900",
  "[&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:font-semibold [&_h4]:text-slate-900",
  "[&_p]:my-3",
  "[&_a]:font-medium [&_a]:text-uos-red [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-uos-red-dark",
  "[&_strong]:font-semibold [&_strong]:text-slate-900",
  "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_li]:my-1 [&_li>ul]:my-1 [&_li>ol]:my-1 [&_li::marker]:text-uos-red",
  "[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-uos-red [&_blockquote]:bg-uos-red-light [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:italic [&_blockquote]:text-slate-600",
  "[&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.875em] [&_code]:text-uos-red-dark",
  "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-6",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-slate-100",
  "[&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
  "[&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
  "[&_td]:border [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2",
  "[&_hr]:my-6 [&_hr]:border-slate-200",
  "[&_img]:max-w-full [&_img]:rounded-lg",
].join(" ");

export default function MarkdownEditor() {
  const [content, setContent] = useState(load);
  const [mode, setMode] = useState<Mode>("split");
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const pending = useRef<[number, number] | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(KEY, content);
      } catch {
        /* Speicher nicht verfügbar – ignorieren */
      }
    }, 300);
    return () => clearTimeout(id);
  }, [content]);

  // Auswahl nach programmatischer Änderung wiederherstellen
  useLayoutEffect(() => {
    const ta = ref.current;
    if (ta && pending.current) {
      ta.focus();
      ta.setSelectionRange(...pending.current);
      pending.current = null;
    }
  }, [content]);

  const html = useMemo(
    () => DOMPurify.sanitize(marked.parse(content, { async: false, gfm: true, breaks: true })),
    [content],
  );

  const stats = useMemo(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    return { words, chars: content.length };
  }, [content]);

  const apply = (next: string, selStart: number, selEnd: number) => {
    pending.current = [selStart, selEnd];
    setContent(next);
  };

  /** Umschließt die Auswahl mit Syntax (z. B. **…**) bzw. entfernt sie wieder. */
  const wrap = (before: string, after = before, placeholder = "Text") => {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const sel = value.slice(s, e);
    if (s >= before.length && value.slice(s - before.length, s) === before && value.slice(e, e + after.length) === after) {
      const next = value.slice(0, s - before.length) + sel + value.slice(e + after.length);
      return apply(next, s - before.length, e - before.length);
    }
    const text = sel || placeholder;
    const next = value.slice(0, s) + before + text + after + value.slice(e);
    apply(next, s + before.length, s + before.length + text.length);
  };

  /** Setzt ein Präfix vor jede ausgewählte Zeile (Überschrift, Listen, Zitat). */
  const prefixLines = (prefix: (i: number) => string, pattern: RegExp) => {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    const nl = value.indexOf("\n", e);
    const lineEnd = nl === -1 ? value.length : nl;
    const lines = value.slice(lineStart, lineEnd).split("\n");
    const allHave = lines.every((l) => pattern.test(l));
    const block = lines.map((l, i) => (allHave ? l.replace(pattern, "") : prefix(i) + l.replace(pattern, ""))).join("\n");
    const next = value.slice(0, lineStart) + block + value.slice(lineEnd);
    apply(next, lineStart, lineStart + block.length);
  };

  const insertLink = () => {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const text = value.slice(s, e) || "Linktext";
    const url = "https://";
    const next = value.slice(0, s) + `[${text}](${url})` + value.slice(e);
    const urlStart = s + text.length + 3;
    apply(next, urlStart, urlStart + url.length);
  };

  const insertCode = () => {
    const ta = ref.current;
    if (!ta) return;
    const sel = ta.value.slice(ta.selectionStart, ta.selectionEnd);
    if (sel.includes("\n")) wrap("```\n", "\n```", "");
    else wrap("`", "`", "Code");
  };

  const tools: { label: string; icon: ReactNode; run: () => void; shortcut?: string }[] = [
    { label: "Fett", icon: <Bold className="h-4 w-4" />, run: () => wrap("**", "**", "fetter Text"), shortcut: "Strg+B" },
    { label: "Kursiv", icon: <Italic className="h-4 w-4" />, run: () => wrap("*", "*", "kursiver Text"), shortcut: "Strg+I" },
    { label: "Überschrift", icon: <Heading2 className="h-4 w-4" />, run: () => prefixLines(() => "## ", /^#{1,6}\s/) },
    { label: "Liste", icon: <List className="h-4 w-4" />, run: () => prefixLines(() => "- ", /^[-*+]\s/) },
    { label: "Nummerierte Liste", icon: <ListOrdered className="h-4 w-4" />, run: () => prefixLines((i) => `${i + 1}. `, /^\d+\.\s/) },
    { label: "Link", icon: <Link className="h-4 w-4" />, run: insertLink },
    { label: "Code", icon: <Code className="h-4 w-4" />, run: insertCode },
    { label: "Zitat", icon: <Quote className="h-4 w-4" />, run: () => prefixLines(() => "> ", /^>\s?/) },
  ];

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
    const k = e.key.toLowerCase();
    if (k === "b") {
      e.preventDefault();
      wrap("**", "**", "fetter Text");
    } else if (k === "i") {
      e.preventDefault();
      wrap("*", "*", "kursiver Text");
    }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "dokument.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  };

  const clear = () => {
    if (content && window.confirm("Den gesamten Text wirklich löschen?")) apply("", 0, 0);
  };

  const modes: { id: Mode; label: string; icon: ReactNode }[] = [
    { id: "editor", label: "Editor", icon: <PenLine className="h-4 w-4" /> },
    { id: "split", label: "Geteilt", icon: <Columns2 className="h-4 w-4" /> },
    { id: "preview", label: "Vorschau", icon: <Eye className="h-4 w-4" /> },
  ];

  const actionBtn =
    "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-uos-red hover:text-uos-red focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-uos-red/20";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Markdown-Editor</h1>
          <p className="mt-1 text-slate-500">Schreiben mit Live-Vorschau – wird automatisch gespeichert.</p>
        </div>
        <div role="tablist" aria-label="Ansicht" className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          {modes.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                mode === m.id ? "bg-uos-red text-white shadow-sm" : "text-slate-600 hover:text-uos-red"
              }`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>
      </header>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="toolbar" aria-label="Formatierung" className="flex flex-wrap gap-1">
            {tools.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={t.run}
                onMouseDown={(e) => e.preventDefault()}
                disabled={mode === "preview"}
                title={t.shortcut ? `${t.label} (${t.shortcut})` : t.label}
                aria-label={t.label}
                className="rounded-lg p-2 text-slate-600 transition hover:bg-uos-red-light hover:text-uos-red disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-600"
              >
                {t.icon}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={download} className={actionBtn}>
              <Download className="h-4 w-4" /> Als .md herunterladen
            </button>
            <button type="button" onClick={copy} className={actionBtn}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Kopiert" : "Kopieren"}
            </button>
            <button
              type="button"
              onClick={clear}
              className={`${actionBtn} hover:border-red-500 hover:text-red-600`}
            >
              <Trash2 className="h-4 w-4" /> Leeren
            </button>
          </div>
        </div>

        <div className={`grid gap-4 ${mode === "split" ? "lg:grid-cols-2" : ""}`}>
          {mode !== "preview" && (
            <textarea
              ref={ref}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck
              aria-label="Markdown-Text"
              placeholder="Hier Markdown schreiben …"
              className="min-h-[28rem] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-uos-red focus:bg-white focus:ring-4 focus:ring-uos-red/15"
            />
          )}
          {mode !== "editor" && (
            <div
              aria-label="Vorschau"
              className={`min-h-[28rem] overflow-auto rounded-xl border border-slate-200 bg-white p-6 ${PROSE}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>

        <p className="text-right text-sm text-slate-500">
          {stats.words.toLocaleString("de-DE")} {stats.words === 1 ? "Wort" : "Wörter"} ·{" "}
          {stats.chars.toLocaleString("de-DE")} Zeichen
        </p>
      </Card>
    </div>
  );
}
