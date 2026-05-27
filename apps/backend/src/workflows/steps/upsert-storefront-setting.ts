import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { STOREFRONT_SETTINGS_MODULE } from "../../modules/storefront-settings"
import StorefrontSettingsModuleService from "../../modules/storefront-settings/service"

type Input = {
  settings: { key: string; value: any }[]
}

export const upsertStorefrontSettingStep = createStep(
  "upsert-storefront-setting",
  async (input: Input, { container }) => {
    const storefrontSettingsService: StorefrontSettingsModuleService =
      container.resolve(STOREFRONT_SETTINGS_MODULE)

    const results = []
    const previousValues = []

    for (const setting of input.settings) {
      const [existing] = await storefrontSettingsService.listStorefrontSettings({
        key: setting.key,
      })

      let result
      if (existing) {
        result = await storefrontSettingsService.updateStorefrontSettings({
          id: existing.id,
          value: setting.value,
        })
      } else {
        result = await storefrontSettingsService.createStorefrontSettings({
          key: setting.key,
          value: setting.value,
        })
      }

      results.push(result)
      previousValues.push({ key: setting.key, previousValue: existing?.value })
    }

    return new StepResponse(results, previousValues)
  },
  async (compensationData, { container }) => {
    if (!compensationData) return

    const storefrontSettingsService: StorefrontSettingsModuleService =
      container.resolve(STOREFRONT_SETTINGS_MODULE)

    for (const { key, previousValue } of compensationData) {
      const [existing] = await storefrontSettingsService.listStorefrontSettings({
        key,
      })

      if (existing) {
        if (previousValue !== undefined) {
          await storefrontSettingsService.updateStorefrontSettings({
            id: existing.id,
            value: previousValue,
          })
        } else {
          await storefrontSettingsService.deleteStorefrontSettings(existing.id)
        }
      }
    }
  }
)
