/**
 * AEGISX Production Central Configuration
 */

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};

export const API_BASE =
  metaEnv.VITE_API_URL ||
  "https://aegisx-db.onrender.com/api/v1";

export const WS_BASE =
  metaEnv.VITE_WS_URL ||
  API_BASE.replace("https://", "wss://")
          .replace("http://", "ws://")
          .replace(/\/api\/v1\/?$/, "");

export const WS_URL = WS_BASE.endsWith("/ws/sos") ? WS_BASE : `${WS_BASE}/ws/sos`;

console.log("API:", API_BASE.replace(/\/api\/v1\/?$/, ""));
console.log("WS:", WS_URL);
