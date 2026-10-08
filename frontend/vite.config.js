import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During `npm run dev`, requests to /predict, /history, /diseases, /stats,
// /uploads etc. are proxied to the FastAPI server on :8000, so the app
// works identically in dev and in the single-process production build.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/predict": "http://127.0.0.1:8000",
      "/history": "http://127.0.0.1:8000",
      "/diseases": "http://127.0.0.1:8000",
      "/remedy": "http://127.0.0.1:8000",
      "/stats": "http://127.0.0.1:8000",
      "/health": "http://127.0.0.1:8000",
      "/uploads": "http://127.0.0.1:8000",
    },
  },
});
