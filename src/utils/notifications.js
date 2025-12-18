export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false

  if (Notification.permission === "granted") return true
  if (Notification.permission === "denied") return false

  const permission = await Notification.requestPermission()
  return permission === "granted"
}

export function notify(title, body, icon) {
  if (Notification.permission !== "granted") return

  new Notification(title, {
    body,
    icon
  })
}
