import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

const DEFAULT_SETTINGS = {
  hero: {
    title: "The Art of Fragrance",
    subtitle: "Discover our curated collection of luxury perfumes, crafted with the finest ingredients.",
    buttonText: "Explore Collection",
    productId: "",
  },
  crafted: {
    title: "Crafted with Intention",
    content: "Each fragrance in our collection tells a story, blending rare essences and timeless craftsmanship. From the first note to the lingering finish, our perfumes are designed to evoke emotion and leave a lasting impression.",
    buttonText: "View All",
    productId: "",
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

export function useStorefrontSettings() {
  const { data, isLoading } = useQuery({
    queryKey: ["storefront-settings"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/store/storefront-settings")
      return response as { settings: typeof DEFAULT_SETTINGS }
    },
    staleTime: 0,
    refetchOnMount: true,
  })

  // Deep merge: merge each top-level key individually to preserve nested updates
  const settings: typeof DEFAULT_SETTINGS = data?.settings
    ? {
        hero: { ...DEFAULT_SETTINGS.hero, ...data.settings.hero },
        crafted: { ...DEFAULT_SETTINGS.crafted, ...data.settings.crafted },
        newArrivals: { ...DEFAULT_SETTINGS.newArrivals, ...data.settings.newArrivals },
        philosophy: { ...DEFAULT_SETTINGS.philosophy, ...data.settings.philosophy },
        footer: { ...DEFAULT_SETTINGS.footer, ...data.settings.footer },
        promoBanner: { ...DEFAULT_SETTINGS.promoBanner, ...data.settings.promoBanner },
      }
    : DEFAULT_SETTINGS

  return { settings, isLoading }
}
