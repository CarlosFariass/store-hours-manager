import "@shopify/shopify-app-remix/adapters/node"
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server"
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma"
import prisma from "./db.server"
import { Session } from "@shopify/shopify-api"
import { shopifyApi } from "@shopify/shopify-api" 

const shopifyInstance = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: false,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
  hooks: {
    afterAuth: async ({ session }) => {
      await createScriptTag(session)
    },
  },
})

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  apiVersion: ApiVersion.January25,
  hostName: process.env.SHOPIFY_APP_URL!, 
  isEmbeddedApp: true, 
})

async function createScriptTag(session: Session) {
  try {
    const client = new shopify.clients.Rest({ session })

    const existingScriptTags = await client.get({ path: "script_tags" })
    const scriptTagExists = existingScriptTags.body.script_tags.some(
      (tag: { src: string }) =>
        tag.src === `${process.env.SHOPIFY_APP_URL}/public/scripts/store-hours.js`
    )

    if (!scriptTagExists) {
      await client.post({
        path: "script_tags",
        data: {
          script_tag: {
            event: "onload", 
            src: `${process.env.SHOPIFY_APP_URL}/public/scripts/store-hours.js`, 
          },
        },
      })
      console.log("ScriptTag created!")
    } else {
      console.log("ScriptTag already exist.")
    }
  } catch (error) {
    console.error("Erro creating ScriptTag:", error)
  }
}

export default shopifyInstance
export const apiVersion = ApiVersion.January25
export const addDocumentResponseHeaders =
  shopifyInstance.addDocumentResponseHeaders
export const authenticate = shopifyInstance.authenticate
export const unauthenticated = shopifyInstance.unauthenticated
export const login = shopifyInstance.login
export const registerWebhooks = shopifyInstance.registerWebhooks
export const sessionStorage = shopifyInstance.sessionStorage
