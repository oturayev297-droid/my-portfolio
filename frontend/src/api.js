const IS_DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const PROD_API_URL = import.meta.env.VITE_API_URL || ''
const BASE = IS_DEV ? '' : PROD_API_URL
const LANG = '/uz'

async function apiFetch(url, options = {}) {
  const res = await fetch(`${BASE}${LANG}${url}`, {
    ...options,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || data.errors?.[Object.keys(data.errors)[0]]?.[0] || `Request failed (${res.status})`)
  }
  return data
}

export async function fetchProjects() {
  return apiFetch('/api/projects/')
}

export async function submitContact(formData) {
  return apiFetch('/contact/', { method: 'POST', body: formData })
}

export async function aiChat(message, history = []) {
  const res = await fetch(`${BASE}/ai-chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })
  if (!res.ok) throw new Error('AI chat failed')
  return res.json()
}

export async function fetchExperiences() {
  return apiFetch('/resume/')
}
