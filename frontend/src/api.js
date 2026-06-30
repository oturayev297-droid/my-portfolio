const IS_DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const PROD_API_URL = import.meta.env.VITE_API_URL || ''
const BASE = IS_DEV ? '' : PROD_API_URL
const LANG = '/uz'

async function apiFetch(url, options = {}) {
  if (!IS_DEV && !PROD_API_URL) {
    console.warn(
      '⚠️ VITE_API_URL o\'rnatilmagan! Frontend API\'ni topa olmayapti.\n' +
      'Vercel > Project Settings > Environment Variables ga qo\'shing:\n' +
      'VITE_API_URL=https://your-app.railway.app'
    )
  }

  const fullUrl = url.startsWith('/api/')
    ? `${BASE}${url}`       // /api/* → hech qanday til prefiksi yo'q
    : `${BASE}${LANG}${url}` // /uz/* → template sahifalar

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    },
  })

  const contentType = res.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    const text = await res.text()
    const snippet = text.substring(0, 150).replace(/\n/g, ' ')
    throw new Error(
      `Backend JSON emas, HTML qaytardi.\n` +
      `URL: ${fullUrl}\n` +
      `Status: ${res.status}\n` +
      `Javob: ${snippet}...\n\n` +
      `Ehtimoliy sabablar:\n` +
      `• VITE_API_URL noto'g'ri yoki o'rnatilmagan (Vercel env vars ga qo'shing)\n` +
      `• Backendda bu endpoint yo'q (404)\n` +
      `• URL noto'g'ri (trailing slash, prefiks)`
    )
  }

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || data.errors?.[Object.keys(data.errors)[0]]?.[0] || `So'rov bajarilmadi (${res.status})`)
  }
  return data
}

export async function fetchProjects() {
  return apiFetch('/api/projects/')
}

export async function submitContact(formData) {
  return apiFetch('/api/contact/', { method: 'POST', body: formData })
}

export async function aiChat(message, history = []) {
  const url = `${BASE}/ai-chat/`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })

  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    const text = await res.text()
    throw new Error(
      `AI chat: backend JSON emas qaytardi (${res.status}).\n` +
      `URL: ${url}\n` +
      `Javob: ${text.substring(0, 100)}...`
    )
  }

  if (!res.ok) throw new Error('AI chat failed')
  return res.json()
}

export async function fetchExperiences() {
  return apiFetch('/api/experiences/')
}
