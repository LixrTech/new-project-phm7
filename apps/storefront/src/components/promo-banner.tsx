import { useStorefrontSettings } from "@/lib/hooks/use-storefront-settings"

const PromoBanner = () => {
  const { settings, isLoading } = useStorefrontSettings()

  if (isLoading || !settings?.promoBanner?.enabled) {
    return null
  }

  return (
    <div
      className="w-full py-2 px-4 text-center text-sm"
      style={{
        backgroundColor: settings.promoBanner.backgroundColor,
        color: settings.promoBanner.textColor,
      }}
    >
      {settings.promoBanner.text}
    </div>
  )
}

export default PromoBanner
