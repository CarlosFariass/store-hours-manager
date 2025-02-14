import React, { useState } from "react"
import "./StoreHoursConfigForm.css" 

interface StoreHoursConfigFormProps {
  openTime: string
  closeTime: string
  setOpenTime: (time: string) => void
  setCloseTime: (time: string) => void
  onSave: () => void
}

export const StoreHoursConfigForm: React.FC<StoreHoursConfigFormProps> = ({
  openTime,
  closeTime,
  setOpenTime,
  setCloseTime,
  onSave,
}) => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false) 

  const handleSave = async () => {
    if (openTime >= closeTime) {
      setError("❌ Closing time must be later than opening time.")
      setSuccess(false)
      return
    }

    setError(null)
    setLoading(true) 

    try {
      await onSave() 
      setSuccess(true)
    } catch (error) {
      setError("⚠️ Error saving, try again.")
    } finally {
      setLoading(false) 
    }
  }

  return (
    <div className="container">
      <h1 className="welcome-title">👋 Welcome! Here you can change your store hours.</h1>

      <div className="form-container">
        <h2 className="title">Set operating hours</h2>

        <div className="formGroup">
          <label className="label">
            Open:
            <input
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="input"
            />
          </label>
        </div>

        <div className="formGroup">
          <label className="label">
            Close:
            <input
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="input"
            />
          </label>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">✅ Store hours saved successfully!</p>}

        <button onClick={handleSave} className="button" disabled={loading}>
          {loading ? "Saving..." : "💾 Save"} 
        </button>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  )
}
