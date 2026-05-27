import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { upsertStorefrontSettingStep } from "./steps/upsert-storefront-setting"

type Input = {
  settings: { key: string; value: any }[]
}

export const upsertStorefrontSettingsWorkflow = createWorkflow(
  "upsert-storefront-settings",
  function (input: Input) {
    // Call the step directly with the entire settings array
    // The step will handle upserting all settings
    const results = upsertStorefrontSettingStep(input)

    return new WorkflowResponse({ results })
  }
)
