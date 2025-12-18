export function saveCache(key, data, ttlMinutes = 60) {
  const payload = {
    data,
    expires: Date.now() + ttlMinutes * 60 * 1000
  }
  localStorage.setItem(key, JSON.stringify(payload))
}

export function loadCache(key) {
  const raw = localStorage.getItem(key)
  if (!raw) return null

  const payload = JSON.parse(raw)
  if (Date.now() > payload.expires) {
    localStorage.removeItem(key)
    return null
  }

  return payload.data
}
