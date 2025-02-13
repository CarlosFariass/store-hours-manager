(async function () {
  try {

    const response = await fetch("https://tc-freight-more-modem.trycloudflare.com/api/store-hours")
    if (!response.ok) {
      throw new Error("Erro ao buscar horários da loja")
    }

    const { openTime, closeTime } = await response.json()

    // getting
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    const formattedTime = `${currentHour.toString().padStart(2, "0")}:${currentMinutes.toString().padStart(2, "0")}`

    // check open
    const isOpen = formattedTime >= openTime && formattedTime <= closeTime

    const findAddToCartButton = () => {
      // by text
      const buttons = Array.from(document.querySelectorAll("button"))
      const addToCartTexts = ["Add to Cart", "Add to cart", "Check out", "Quick buy", "Buy it now"]
      const buttonByText = buttons.find((button) =>
        addToCartTexts.some((text) => button.textContent.trim().includes(text))
      )

      if (buttonByText) return buttonByText

      // by attr
      const buttonByType = document.querySelector('button[type="submit"]')
      if (buttonByType) return buttonByType

      // by class
      const buttonByClass = document.querySelector(".add-to-cart, .product-form__submit, .btn--add-to-cart")
      if (buttonByClass) return buttonByClass

      return null
    }

    const addToCartButton = findAddToCartButton()

    if (addToCartButton) {
      // disable
      addToCartButton.disabled = !isOpen
      addToCartButton.style.opacity = isOpen ? "1" : "0.5"

      if (!isOpen) {
        const message = document.createElement("p")
        message.textContent = "Store close! Come back tomorrow."
        message.style.color = "#000"
        message.style.marginTop = "12px"
        addToCartButton.insertAdjacentElement("afterend", message)
      }
    } else {
      console.error("Btn 'Add to Cart' not founded.") 
    }
  } catch (error) {
    console.error("Error checking store hours:", error)
  }
})()