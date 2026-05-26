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
        className="text-[11px] sm:text-xs uppercase hover:text-neutral-500 transition-colors font-normal h-full flex items-center"
        style={{ letterSpacing: '0.2em' }}
      >
        SHOP
      </Link>

      {isOpen && (
        <div className="absolute top-full left-0 pt-0 z-50">
          <div className="bg-white border-t border-neutral-200 shadow-md min-w-[240px] py-6 px-6">
            {/* Collections Section */}
            {collections && collections.length > 0 && (
              <div className="mb-6">
                <h3 
                  className="text-[10px] uppercase text-neutral-400 mb-3"
                  style={{ letterSpacing: '0.15em', fontWeight: 400 }}
                >
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
                      className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                      style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
                    >
                      {collection.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Section */}
            {categories && categories.length > 0 && (
              <div>
                <h3 
                  className="text-[10px] uppercase text-neutral-400 mb-3"
                  style={{ letterSpacing: '0.15em', fontWeight: 400 }}
                >
                  CATEGORIES
                </h3>
                <div className="space-y-2">
                  <Link
                    to="/$countryCode/store"
                    params={{ countryCode: countryCode || "us" }}
                    className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                    style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
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
                      className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                      style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* If no collections or categories */}
            {(!collections || collections.length === 0) && (!categories || categories.length === 0) && (
              <div>
                <Link
                  to="/$countryCode/store"
                  params={{ countryCode: countryCode || "us" }}
                  className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
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
