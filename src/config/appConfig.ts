/**
 * AEGISX Production Central Configuration
 */

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const API_BASE =
  metaEnv.VITE_API_URL ||
  (isLocalhost ? "http://localhost:8000/api/v1" : "https://aegisx-db.onrender.com/api/v1");

export const WS_BASE =
  metaEnv.VITE_WS_URL ||
  API_BASE.replace("https://", "wss://")
          .replace("http://", "ws://")
          .replace(/\/api\/v1\/?$/, "");

export const WS_URL = WS_BASE.endsWith("/ws/sos") ? WS_BASE : `${WS_BASE}/ws/sos`;

console.log("API:", API_BASE.replace(/\/api\/v1\/?$/, ""));
console.log("WS:", WS_URL);
