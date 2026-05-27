import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "storefront_setting",
    fields: ["id", "key", "value"],
  })

  const settingsMap: Record<string, any> = {}
  data.forEach((setting: any) => {
    settingsMap[setting.key] = setting.value
  })

  return res.json({ settings: settingsMap })
}
