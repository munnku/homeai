const TIMEOUT_MS = 30_000

export async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export async function assertOk(res: Response, label: string): Promise<void> {
  if (!res.ok) {
    const body = await Promise.resolve().then(() => res.text()).catch(() => '')
    throw new Error(`${label} API error: ${res.status}${body ? ` - ${body}` : ''}`)
  }
}
