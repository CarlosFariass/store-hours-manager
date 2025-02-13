import { ActionFunction, LoaderFunction, json } from "@remix-run/node"

let storeHours = {
  openTime: "09:00", 
  closeTime: "18:00", 
}

// GET
export const loader: LoaderFunction = async ({ request }) => {
  //CORS
  const headers = new Headers()
  headers.set("Access-Control-Allow-Origin", "https://studioforty9-application-test.myshopify.com")
  headers.set("Access-Control-Allow-Methods", "GET")

  return json(storeHours, { headers })
}

// POST
export const action: ActionFunction = async ({ request }) => {
  try {
    const data = await request.json()

    if (!data.openTime || !data.closeTime) {
      return json({ error: "openTime e closeTime are mandatory" }, { status: 400 })
    }

    storeHours = {
      openTime: data.openTime,
      closeTime: data.closeTime,
    }

    return json({ message: "Saved successfully!" }, { status: 200 })
  } catch (error) {
    return json({ error: "Error processing request" }, { status: 500 })
  }
}