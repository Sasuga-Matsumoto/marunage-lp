// TODO: 丸投げ節税用のGoogle Apps Scriptをデプロイしたらここに Web App URL を設定する
const GAS_URL = '';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const UTM_STORAGE_KEY = 'utm_params';

export function captureUtmParams(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const hasUtm = UTM_KEYS.some((key) => params.has(key));
  if (!hasUtm) return;

  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    utm[key] = params.get(key) || '';
  }
  sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
}

export function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fall through
    }
  }

  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    utm[key] = params.get(key) || '';
  }
  return utm;
}

export async function submitToGAS(data: Record<string, string>): Promise<void> {
  if (!GAS_URL) {
    // GAS未設定時はサーバーに送信せず、フォーム体験（遷移・バリデーション）だけ検証できるようにする。
    // 本番デプロイ前に GAS_URL を設定すること。
    if (typeof console !== 'undefined') console.warn('[marunage-lp] GAS_URL is not configured. Skipping submission.', data);
    return;
  }
  await fetch(GAS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(data),
  });
}
