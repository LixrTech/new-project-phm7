import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BuildingStorefront } from "@medusajs/icons"
import { Container, Heading, Button, Input, Label, Textarea, Switch, toast } from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { sdk } from "../../lib/client"

const DEFAULT_SETTINGS = {
  hero: {
    title: "The Art of Fragrance",
    subtitle: "Discover our curated collection of luxury perfumes, crafted with the finest ingredients.",
    buttonText: "Explore Collection",
  },
  crafted: {
    title: "Crafted with Intention",
    content: "Each fragrance in our collection tells a story, blending rare essences and timeless craftsmanship. From the first note to the lingering finish, our perfumes are designed to evoke emotion and leave a lasting impression.",
    buttonText: "View All",
  },
  newArrivals: {
    title: "New Arrivals",
    subtitle: "Explore our latest fragrances, each one a masterpiece of perfumery",
  },
  philosophy: {
    title: "A Philosophy of Scent",
    content: "We believe fragrance is an intimate expression of self. Our perfumes are crafted to enhance your presence, to whisper rather than shout, to linger in memory long after you've left the room.",
    buttonText: "Discover Your Signature",
  },
  footer: {
    brandTagline: "Crafting moments of beauty through the art of fragrance.",
    collectionsLinks: [
      { label: "All Fragrances", url: "/store" },
      { label: "Oud", url: "/store?collection=oud" },
      { label: "kinky + hardcore", url: "/store?collection=kinky-hardcore" },
      { label: "Coming soon", url: "/store?collection=coming-soon" },
    ],
    aboutLinks: [
      { label: "Our Story", url: "/about" },
      { label: "Craftsmanship", url: "/craftsmanship" },
      { label: "Contact", url: "/contact" },
    ],
  },
  promoBanner: {
    enabled: false,
    text: "Free shipping on orders over $50",
    backgroundColor: "#2b2621",
    textColor: "#ffffff",
  },
}

const StorefrontSettingsPage = () => {
  const queryClient = useQueryClient()
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  const { data, isLoading } = useQuery({
    queryKey: ["storefront-settings"],
    queryFn: () => sdk.client.fetch("/admin/storefront-settings"),
  })

  useEffect(() => {
    if (data?.settings) {
      setSettings({ ...DEFAULT_SETTINGS, ...data.settings })
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: (updatedSettings: typeof DEFAULT_SETTINGS) =>
      sdk.client.fetch("/admin/storefront-settings", {
        method: "POST",
        body: { settings: updatedSettings },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storefront-settings"] })
      toast.success("Settings updated successfully")
    },
    onError: () => {
      toast.error("Failed to update settings")
    },
  })

  const handleSave = () => {
    updateMutation.mutate(settings)
  }

  const updateField = (section: string, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const updateArrayField = (section: string, field: string, index: number, key: string, value: string) => {
    setSettings((prev) => {
      const array = [...(prev[section as keyof typeof prev] as any)[field]]
      array[index] = { ...array[index], [key]: value }
      return {
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: array,
        },
      }
    })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Loading...</div>
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <Heading level="h1">Storefront Settings</Heading>
        <Button
          size="small"
          onClick={handleSave}
          isLoading={updateMutation.isPending}
        >
          Save Changes
        </Button>
      </div>

      {/* Promotional Banner */}
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Promotional Banner</Heading>
          <Switch
            checked={settings.promoBanner.enabled}
            onCheckedChange={(checked) => updateField("promoBanner", "enabled", checked)}
          />
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label>Banner Text</Label>
              <Input
                value={settings.promoBanner.text}
                onChange={(e) => updateField("promoBanner", "text", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="flex flex-col gap-y-2">
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={settings.promoBanner.backgroundColor}
                  onChange={(e) => updateField("promoBanner", "backgroundColor", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>Text Color</Label>
                <Input
                  type="color"
                  value={settings.promoBanner.textColor}
                  onChange={(e) => updateField("promoBanner", "textColor", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Hero Section */}
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Hero Section</Heading>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label>Title</Label>
              <Input
                value={settings.hero.title}
                onChange={(e) => updateField("hero", "title", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Subtitle</Label>
              <Textarea
                value={settings.hero.subtitle}
                onChange={(e) => updateField("hero", "subtitle", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Button Text</Label>
              <Input
                value={settings.hero.buttonText}
                onChange={(e) => updateField("hero", "buttonText", e.target.value)}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Crafted Section */}
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Crafted with Intention Section</Heading>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label>Title</Label>
              <Input
                value={settings.crafted.title}
                onChange={(e) => updateField("crafted", "title", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Content</Label>
              <Textarea
                rows={5}
                value={settings.crafted.content}
                onChange={(e) => updateField("crafted", "content", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Button Text</Label>
              <Input
                value={settings.crafted.buttonText}
                onChange={(e) => updateField("crafted", "buttonText", e.target.value)}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* New Arrivals Section */}
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">New Arrivals Section</Heading>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label>Title</Label>
              <Input
                value={settings.newArrivals.title}
                onChange={(e) => updateField("newArrivals", "title", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Subtitle</Label>
              <Textarea
                value={settings.newArrivals.subtitle}
                onChange={(e) => updateField("newArrivals", "subtitle", e.target.value)}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Philosophy Section */}
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Philosophy Section</Heading>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label>Title</Label>
              <Input
                value={settings.philosophy.title}
                onChange={(e) => updateField("philosophy", "title", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Content</Label>
              <Textarea
                rows={5}
                value={settings.philosophy.content}
                onChange={(e) => updateField("philosophy", "content", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Button Text</Label>
              <Input
                value={settings.philosophy.buttonText}
                onChange={(e) => updateField("philosophy", "buttonText", e.target.value)}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Footer */}
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Footer</Heading>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label>Brand Tagline</Label>
              <Input
                value={settings.footer.brandTagline}
                onChange={(e) => updateField("footer", "brandTagline", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>Collections Links</Label>
              {settings.footer.collectionsLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-2 gap-x-2">
                  <Input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => updateArrayField("footer", "collectionsLinks", index, "label", e.target.value)}
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateArrayField("footer", "collectionsLinks", index, "url", e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>About Links</Label>
              {settings.footer.aboutLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-2 gap-x-2">
                  <Input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => updateArrayField("footer", "aboutLinks", index, "label", e.target.value)}
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateArrayField("footer", "aboutLinks", index, "url", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Storefront",
  icon: BuildingStorefront,
})

export default StorefrontSettingsPage
