import { useEffect, useState } from "react"
import { StoreHoursConfigForm } from "./components/StoreHoursConfigForm"

export default function StoreHoursPage() {
  const [openTime, setOpenTime] = useState<string | null>(null)
  const [closeTime, setCloseTime] = useState<string | null>(null)

  useEffect(() => {
    async function getStorehours() {
      const response = await fetch("/api/store-hours")
      if (!response.ok) {
        console.error("Error loading store hours")
        return
      }
      const data = await response.json()
      if (data.openTime && data.closeTime) {
        setOpenTime(data.openTime)
        setCloseTime(data.closeTime)
      }
    }

    getStorehours()
  }, [])

  const handleSave = async () => {
    if (!openTime || !closeTime) {
      alert("Please set both open and close times.")
      return
    }

    if (openTime >= closeTime) {
      alert("Open time must be before close time.")
      return
    }

    const response = await fetch("/api/store-hours", {
      method: "POST",
      body: JSON.stringify({ openTime, closeTime }),
      headers: { "Content-Type": "application/json" },
    })
    const data = await response.json()
    if (data.success) {
      alert("Store hours saved successfully!")
    }
  }

  return (
    <div>
      <StoreHoursConfigForm
        openTime={openTime || ""}
        closeTime={closeTime || ""}
        setOpenTime={(time) => setOpenTime(time)}
        setCloseTime={(time) => setCloseTime(time)}
        onSave={handleSave}
      />
    </div>
  )
}