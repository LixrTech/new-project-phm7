import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { STOREFRONT_SETTINGS_MODULE } from "../../modules/storefront-settings"
import StorefrontSettingsModuleService from "../../modules/storefront-settings/service"

type Input = {
  key: string
  value: any
}

export const upsertStorefrontSettingStep = createStep(
  "upsert-storefront-setting",
  async (input: Input, { container }) => {
    const storefrontSettingsService: StorefrontSettingsModuleService =
      container.resolve(STOREFRONT_SETTINGS_MODULE)

    const [existing] = await storefrontSettingsService.listStorefrontSettings({
      key: input.key,
    })

    let setting
    if (existing) {
      setting = await storefrontSettingsService.updateStorefrontSettings({
        id: existing.id,
        value: input.value,
      })
    } else {
      setting = await storefrontSettingsService.createStorefrontSettings({
        key: input.key,
        value: input.value,
      })
    }

    return new StepResponse(setting, { key: input.key, previousValue: existing?.value })
  },
  async (compensationData, { container }) => {
    if (!compensationData) return

    const storefrontSettingsService: StorefrontSettingsModuleService =
      container.resolve(STOREFRONT_SETTINGS_MODULE)

    const [existing] = await storefrontSettingsService.listStorefrontSettings({
      key: compensationData.key,
    })

    if (existing) {
      if (compensationData.previousValue !== undefined) {
        await storefrontSettingsService.updateStorefrontSettings({
          id: existing.id,
          value: compensationData.previousValue,
        })
      } else {
        await storefrontSettingsService.deleteStorefrontSettings(existing.id)
      }
    }
  }
)
