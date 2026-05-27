import { MedusaService } from "@medusajs/framework/utils"
import StorefrontSetting from "./models/storefront-setting"

class StorefrontSettingsModuleService extends MedusaService({
  StorefrontSetting,
}) {}

export default StorefrontSettingsModuleService
