import { useLocation, useLoaderData, Link } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useProducts } from "@/lib/hooks/use-products"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"

const Home = () => {
  const location = useLocation()
  const { region } = useLoaderData({ from: "/$countryCode/" })
  const countryCode = getCountryCodeFromPath(location.pathname) || "us"

  const { data: productsData } = useProducts({
    region_id: region?.id,
    query_params: { 
      limit: 4,
      fields: "id,title,handle,thumbnail,*images,*variants,*variants.calculated_price",
    },
  })

  const products = productsData?.pages?.[0]?.products || []

  return (
    <div className="min-h-screen">
      {/* Hero Section - Warm Beige with Product */}
      <section 
        className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#d4c4a8' }}
      >
        <div className="content-container grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center py-20 md:py-32 px-6">
          {/* Left: Text */}
          <div className="flex flex-col gap-6 md:gap-8 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-white leading-tight">
              The Art of Fragrance
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-md leading-relaxed mx-auto lg:mx-0">
              Discover our curated collection of luxury perfumes, crafted with the finest ingredients.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Link
                to="/$countryCode/store"
                params={{ countryCode }}
              >
                <Button 
                  className="bg-white text-neutral-900 hover:bg-neutral-100 px-6 md:px-8 py-5 md:py-6 text-xs md:text-sm uppercase tracking-wider font-medium"
                >
                  Explore Collection
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Product Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[280px] md:max-w-md aspect-[3/4]">
              {products[0]?.thumbnail && (
                <img
                  src={products[0].thumbnail}
                  alt="Featured Fragrance"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Crafted with Intention Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="content-container px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left: Image */}
            <div className="relative aspect-square bg-neutral-100 overflow-hidden">
              {products[1]?.thumbnail && (
                <img
                  src={products[1].thumbnail}
                  alt="Craftsmanship"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Right: Text */}
            <div className="flex flex-col gap-6 md:gap-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-neutral-900 leading-tight">
                Crafted with Intention
              </h2>
              <div className="space-y-4 text-sm md:text-base text-neutral-600 leading-relaxed">
                <p>
                  Each fragrance in our collection tells a story, blending rare essences and timeless craftsmanship.
                </p>
                <p>
                  From the first note to the lingering finish, our perfumes are designed to evoke emotion and leave a lasting impression.
                </p>
              </div>
              <div>
                <Link
                  to="/$countryCode/store"
                  params={{ countryCode }}
                >
                  <Button 
                    variant="secondary"
                    className="border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white px-6 md:px-8 py-5 md:py-6 text-xs md:text-sm uppercase tracking-wider font-medium"
                  >
                    View All
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="content-container px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-neutral-900 mb-3 md:mb-4">
              New Arrivals
            </h2>
            <p className="text-sm md:text-base text-neutral-600 max-w-2xl mx-auto">
              Explore our latest fragrances, each one a masterpiece of perfumery
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant={product.variants?.[0]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section - Dark */}
      <section 
        className="py-20 md:py-32"
        style={{ backgroundColor: '#2b2621' }}
      >
        <div className="content-container text-center px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-white mb-6 md:mb-8">
            A Philosophy of Scent
          </h2>
          <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed mb-8 md:mb-12">
            We believe fragrance is an intimate expression of self. Our perfumes are crafted to enhance your presence, to whisper rather than shout, to linger in memory long after you've left the room.
          </p>
          <Link
            to="/$countryCode/store"
            params={{ countryCode }}
          >
            <Button 
              className="bg-white text-neutral-900 hover:bg-neutral-100 px-6 md:px-8 py-5 md:py-6 text-xs md:text-sm uppercase tracking-wider font-medium"
            >
              Discover Your Signature
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
