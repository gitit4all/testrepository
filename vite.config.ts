import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Relative base, damit die Seite unter https://<user>.github.io/<repo>/ funktioniert.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
