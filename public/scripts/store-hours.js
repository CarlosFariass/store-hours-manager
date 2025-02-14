(async function () {
  try {
    const response = await fetch("/apps/store-hours", {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    })

    if (!response.ok) {
      throw new Error("Error fetching store hours")
    }

    const { openTime, closeTime } = await response.json()

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    const formattedTime = `${currentHour.toString().padStart(2, "0")}:${currentMinutes.toString().padStart(2, "0")}`

    const isOpen = formattedTime >= openTime && formattedTime <= closeTime

    // Some default texts for buy buttons or checkout
    const addToCartTexts = ["Add to Cart", "Add to cart", "Check out", "Quick buy", "Buy it now"]

    const findAddToCartButtons = () => {
      const buttons = Array.from(document.querySelectorAll("button, a, input[type='submit']"))
      return buttons.filter((button) => {
        const buttonText = button.textContent?.trim() || button.value?.trim() || ""
        return (
          addToCartTexts.some((text) => buttonText.includes(text)) ||
          button.classList.contains("add-to-cart") ||
          button.classList.contains("product-form__submit") ||
          button.classList.contains("btn--add-to-cart") ||
          button.getAttribute("type") === "submit"
        )
      })
    }

    const addToCartButtons = findAddToCartButtons()

    addToCartButtons.forEach((button) => {
      button.disabled = !isOpen
      button.style.opacity = isOpen ? "1" : "0.5"

      if (!isOpen) {
        const message = document.createElement("p")
        message.textContent = "Store closed! Come back tomorrow."
        message.style.color = "#000"
        message.style.marginTop = "12px"
        button.insertAdjacentElement("afterend", message)
      }
    })

    const validateCart = async () => {
      const response = await fetch("/apps/validate-cart", {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })

      const { valid, message } = await response.json()

      if (!valid) {
        alert(message) 
        return false
      }
      return true
    }

    document.querySelector("form[action='/checkout']")?.addEventListener("submit", async (e) => {
      if (!await validateCart()) {
        e.preventDefault() 
      }
    })
  } catch (error) {
    console.error("Error checking store hours:", error)
  }
})()