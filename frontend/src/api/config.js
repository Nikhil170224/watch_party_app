// Vite exposes env vars prefixed with VITE_
// Set VITE_API_BASE in Vercel dashboard for production
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
