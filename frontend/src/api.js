const IS_DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const PROD_API_URL = import.meta.env.VITE_API_URL || 'https://your-backend.railway.app'
const BASE = IS_DEV ? '' : PROD_API_URL
const LANG = '/uz'

export async function fetchProjects() {
  const res = await fetch(`${BASE}${LANG}/api/projects/`)
  if (!res.ok) throw new Error('Failed to load projects')
  return res.json()
}

export async function submitContact(data) {
  const res = await fetch(`${BASE}${LANG}/contact/`, {
    method: 'POST',
    body: data,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  })
  return res.json()
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
  const res = await fetch(`${BASE}${LANG}/resume/`)
  if (!res.ok) throw new Error('Failed to load experiences')
  return res.json()
}
