import { MiddlewareRoute, validateAndTransformBody } from "@medusajs/framework"
import { z } from "@medusajs/framework/zod"

const UpdateSettingsSchema = z.object({
  settings: z.record(z.string(), z.any()),
})

export const storefrontSettingsMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/storefront-settings",
    method: "POST",
    middlewares: [validateAndTransformBody(UpdateSettingsSchema)],
  },
]
