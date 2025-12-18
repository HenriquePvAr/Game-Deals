import { useEffect, useState } from "react"

export default function useCountdown(endDate) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    if (!endDate) return

    const end = new Date(endDate).getTime()

    const interval = setInterval(() => {
      const now = Date.now()
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft(null)
        clearInterval(interval)
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft(
        `${days}d ${hours}h ${minutes}m ${seconds}s`
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [endDate])

  return timeLeft
}
