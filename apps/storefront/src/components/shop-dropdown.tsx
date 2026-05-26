import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useCategories } from "@/lib/hooks/use-categories"
import { useCollections } from "@/lib/hooks/use-collections"
import { useState, useRef, useEffect } from "react"

export const ShopDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: categories } = useCategories({
    fields: "id,name,handle",
    queryParams: { parent_category_id: "null" },
  })

  const { data: collections } = useCollections({
    fields: "id,title,handle",
  })

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Close dropdown when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <div 
      ref={containerRef}
      className="relative h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to="/$countryCode/store"
        params={{ countryCode: countryCode || "us" }}
        className="text-xs uppercase tracking-wider hover:text-neutral-500 transition-colors font-medium h-full flex items-center"
      >
        SHOP
      </Link>

      {isOpen && (
        <div className="absolute top-full left-0 pt-0 z-50">
          <div className="bg-white border border-neutral-200 shadow-lg min-w-[280px] py-6">
            {/* Collections Section */}
            {collections && collections.length > 0 && (
              <div className="px-8 mb-6">
                <h3 className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-3 font-medium">
                  COLLECTIONS
                </h3>
                <div className="space-y-2">
                  {collections.map((collection, index) => (
                    <Link
                      key={collection.id ?? `collection-${index}`}
                      to="/$countryCode/collections/$handle"
                      params={{ 
                        countryCode: countryCode || "us", 
                        handle: collection.handle ?? "" 
                      }}
                      className="block text-sm text-neutral-700 hover:text-neutral-900 transition-colors font-display"
                    >
                      {collection.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Section */}
            {categories && categories.length > 0 && (
              <div className="px-8">
                <h3 className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-3 font-medium">
                  CATEGORIES
                </h3>
                <div className="space-y-2">
                  <Link
                    to="/$countryCode/store"
                    params={{ countryCode: countryCode || "us" }}
                    className="block text-sm text-neutral-700 hover:text-neutral-900 transition-colors font-display"
                  >
                    All Fragrances
                  </Link>
                  {categories.map((category, index) => (
                    <Link
                      key={category.id ?? `category-${index}`}
                      to="/$countryCode/categories/$handle"
                      params={{ 
                        countryCode: countryCode || "us", 
                        handle: category.handle ?? "" 
                      }}
                      className="block text-sm text-neutral-700 hover:text-neutral-900 transition-colors font-display"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* If no collections or categories */}
            {(!collections || collections.length === 0) && (!categories || categories.length === 0) && (
              <div className="px-8">
                <Link
                  to="/$countryCode/store"
                  params={{ countryCode: countryCode || "us" }}
                  className="block text-sm text-neutral-700 hover:text-neutral-900 transition-colors font-display"
                >
                  View All Products
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
