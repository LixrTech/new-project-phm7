import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { upsertStorefrontSettingStep } from "./steps/upsert-storefront-setting"

type Input = {
  settings: { key: string; value: any }[]
}

export const upsertStorefrontSettingsWorkflow = createWorkflow(
  "upsert-storefront-settings",
  function (input: Input) {
    const results = transform({ settings: input.settings }, ({ settings }) => {
      return settings.map((setting) => upsertStorefrontSettingStep(setting))
    })

    return new WorkflowResponse({ results })
  }
)
