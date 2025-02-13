import { useEffect, useState } from "react"
import { StoreHoursConfigForm } from "./components/StoreHoursConfigForm"

export default function StoreHoursPage() {
  const [openTime, setOpenTime] = useState("09:00")
  const [closeTime, setCloseTime] = useState("18:00")

  useEffect(() => {
    async function fetchStoreHours() {
      const response = await fetch('/api/store-hours')
      if (!response.ok) {
        console.error('Error loading')
        return
      }
      const data = await response.json()
      if (data.openTime && data.closeTime) {
        setOpenTime(data.openTime)
        setCloseTime(data.closeTime)
      }
    }
    
    fetchStoreHours()
  }, [])

  const handleSave = async () => {
    const response = await fetch('/api/store-hours', {
      method: 'POST',
      body: JSON.stringify({ openTime, closeTime }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
  }

  return (
    <div>
      <StoreHoursConfigForm
        openTime={openTime}
        closeTime={closeTime}
        setOpenTime={setOpenTime}
        setCloseTime={setCloseTime}
        onSave={handleSave}
      />
    </div>
  )
}

