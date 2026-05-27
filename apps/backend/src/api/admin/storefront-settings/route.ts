import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { upsertStorefrontSettingsWorkflow } from "../../../workflows/upsert-storefront-settings"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "storefront_setting",
    fields: ["id", "key", "value", "created_at", "updated_at"],
  })

  const settingsMap: Record<string, any> = {}
  data.forEach((setting: any) => {
    settingsMap[setting.key] = setting.value
  })

  return res.json({ settings: settingsMap })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { settings } = req.validatedBody as { settings: Record<string, any> }

  const settingsArray = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
  }))

  await upsertStorefrontSettingsWorkflow(req.scope).run({
    input: { settings: settingsArray },
  })

  return res.json({ success: true })
}
