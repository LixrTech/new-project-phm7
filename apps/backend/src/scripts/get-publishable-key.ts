import { ExecArgs } from "@medusajs/framework/types"
import { createApiKeysWorkflow } from "@medusajs/medusa/core-flows"

export default async function getPublishableKey({ container }: ExecArgs) {
  const query = container.resolve("query")
  
  const { data: apiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "type", "title"],
    filters: {
      type: "publishable"
    },
  })

  if (!apiKeys?.length) {
    console.log("\n❌ No publishable API key found!")
    console.log("Creating one for you...\n")
    
    const { result } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            type: "publishable",
            title: "Development",
            created_by: "system"
          },
        ],
      },
    })
    
    const newKey = result[0]
    console.log("✅ Created new publishable API key!\n")
    console.log("==================================================")
    console.log("Publishable API Key:", newKey.id)
    console.log("==================================================")
    console.log("\nAdd this to your storefront .env file:")
    console.log(`VITE_MEDUSA_PUBLISHABLE_KEY=${newKey.id}`)
    console.log("\n")
    return
  }

  const key = apiKeys[0]
  console.log("\n==================================================")
  console.log("Publishable API Key:", key.id)
  console.log("==================================================")
  console.log("\nAdd this to your storefront .env file:")
  console.log(`VITE_MEDUSA_PUBLISHABLE_KEY=${key.id}`)
  console.log("\n")
}
