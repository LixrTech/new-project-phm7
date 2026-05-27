import {
  createWorkflow,
  WorkflowResponse,
  transform,
  parallelize,
} from "@medusajs/framework/workflows-sdk"
import { upsertStorefrontSettingStep } from "./steps/upsert-storefront-setting"

type Input = {
  settings: { key: string; value: any }[]
}

export const upsertStorefrontSettingsWorkflow = createWorkflow(
  "upsert-storefront-settings",
  function (input: Input) {
    const settingsToUpsert = transform({ input }, ({ input }) => {
      return input.settings
    })

    const results = parallelize(
      settingsToUpsert,
      (setting) => upsertStorefrontSettingStep(setting)
    )

    return new WorkflowResponse({ results })
  }
)
