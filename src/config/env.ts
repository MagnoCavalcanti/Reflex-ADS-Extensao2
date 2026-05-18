/** Ativa dados mock (apenas desenvolvimento). Defina VITE_USE_MOCK_API=true no .env.local */
export function isMockApiEnabled(): boolean {
  return import.meta.env.VITE_USE_MOCK_API === "true";
}
