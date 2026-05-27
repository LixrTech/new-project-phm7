import { useLocation, useLoaderData, Link } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useProducts } from "@/lib/hooks/use-products"
import { useStorefrontSettings } from "@/lib/hooks/use-storefront-settings"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"

const Home = () => {
  const location = useLocation()
  const { region } = useLoaderData({ from: "/$countryCode/" })
  const countryCode = getCountryCodeFromPath(location.pathname) || "us"
  const { settings } = useStorefrontSettings()

  const { data: productsData } = useProducts({
    region_id: region?.id,
    query_params: { 
      limit: 4,
      fields: "id,title,handle,thumbnail,*images,*variants,*variants.calculated_price",
    },
  })

  const products = productsData?.pages?.[0]?.products || []

  // Fetch specific products for hero and crafted sections if IDs are set
  const { data: heroProductData } = useProducts({
    region_id: settings.hero.productId ? region?.id : undefined,
    query_params: { 
      id: settings.hero.productId ? [settings.hero.productId] : undefined,
      fields: "id,title,handle,thumbnail,*images,*variants,*variants.calculated_price",
    },
  })

  const { data: craftedProductData } = useProducts({
    region_id: settings.crafted.productId ? region?.id : undefined,
    query_params: { 
      id: settings.crafted.productId ? [settings.crafted.productId] : undefined,
      fields: "id,title,handle,thumbnail,*images,*variants,*variants.calculated_price",
    },
  })

  // Use selected products or fallback to products from list
  const heroProduct = heroProductData?.pages?.[0]?.products?.[0] || products[0]
  const craftedProduct = craftedProductData?.pages?.[0]?.products?.[0] || products[1]

  return (
    <div className="min-h-screen">
      {/* Hero Section - Clean Beige with Product */}
      <section 
        className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[85vh] flex items-center justify-center pt-14 sm:pt-16"
        style={{ backgroundColor: '#d4c4a8' }}
      >
        <div className="max-w-screen-2xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center px-6 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-20">
          {/* Left: Text */}
          <div className="flex flex-col gap-4 sm:gap-6 text-center lg:text-left order-2 lg:order-1">
            <h1 
              className="text-3xl sm:text-5xl lg:text-6xl text-white leading-tight"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '0.02em' }}
            >
              {settings.hero.title}
            </h1>
            <p className="text-sm sm:text-base text-white/85 max-w-md leading-relaxed mx-auto lg:mx-0" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}>
              {settings.hero.subtitle}
            </p>
            <div className="flex justify-center lg:justify-start mt-2 sm:mt-4">
              <Link
                to="/$countryCode/store"
                params={{ countryCode }}
              >
                <Button 
                  className="bg-white text-neutral-900 hover:bg-neutral-50 px-6 sm:px-8 py-3 sm:py-4 text-[11px] sm:text-xs uppercase font-normal shadow-sm"
                  style={{ letterSpacing: '0.15em' }}
                >
                  {settings.hero.buttonText}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Product Image */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[400px] bg-white rounded-sm shadow-lg p-6 sm:p-10 lg:p-12">
              {heroProduct?.thumbnail && (
                <img
                  src={heroProduct.thumbnail}
                  alt="Featured Fragrance"
                  className="w-full h-auto object-contain"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Crafted with Intention Section */}
      <section className="bg-white py-12 sm:py-20 lg:py-28">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            {/* Left: Image */}
            <div className="relative w-full aspect-square bg-neutral-100 overflow-hidden">
              {craftedProduct?.thumbnail && (
                <img
                  src={craftedProduct.thumbnail}
                  alt="Craftsmanship"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Right: Text */}
            <div className="flex flex-col gap-5 sm:gap-7">
              <h2 
                className="text-2xl sm:text-3xl lg:text-4xl text-neutral-900 leading-tight"
                style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
              >
                {settings.crafted.title}
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-neutral-600 leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}>
                <p>
                  {settings.crafted.content}
                </p>
              </div>
              <div>
                <Link
                  to="/$countryCode/store"
                  params={{ countryCode }}
                >
                  <button 
                    className="border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-[11px] sm:text-xs uppercase font-normal transition-colors"
                    style={{ letterSpacing: '0.15em' }}
                  >
                    {settings.crafted.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-neutral-50 py-12 sm:py-20 lg:py-28">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-16">
          <div className="text-center mb-10 sm:mb-14">
            <h2 
              className="text-2xl sm:text-3xl lg:text-4xl text-neutral-900 mb-3"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
            >
              {settings.newArrivals.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl mx-auto" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}>
              {settings.newArrivals.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.slice(0, 4).map((product, index) => (
              <ProductCard
                key={product.id || `product-${index}`}
                product={product}
                variant={product.variants?.[0]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section - Dark */}
      <section 
        className="py-16 sm:py-24 lg:py-32"
        style={{ backgroundColor: '#2b2621' }}
      >
        <div className="max-w-screen-2xl mx-auto text-center px-6 sm:px-8 lg:px-16">
          <h2 
            className="text-2xl sm:text-3xl lg:text-4xl text-white mb-5 sm:mb-7"
            style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
          >
            {settings.philosophy.title}
          </h2>
          <p className="text-sm sm:text-base text-white/75 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}>
            {settings.philosophy.content}
          </p>
          <Link
            to="/$countryCode/store"
            params={{ countryCode }}
          >
            <button 
              className="bg-white text-neutral-900 hover:bg-neutral-50 px-6 sm:px-8 py-3 sm:py-4 text-[11px] sm:text-xs uppercase font-normal shadow-sm transition-colors"
              style={{ letterSpacing: '0.15em' }}
            >
              {settings.philosophy.buttonText}
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
