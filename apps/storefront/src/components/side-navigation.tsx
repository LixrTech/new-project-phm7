import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useCategories } from "@/lib/hooks/use-categories"
import { useCollections } from "@/lib/hooks/use-collections"
import { X } from "@medusajs/icons"
import { useEffect } from "react"

interface SideNavigationProps {
  isOpen: boolean
  onClose: () => void
}

export const SideNavigation = ({ isOpen, onClose }: SideNavigationProps) => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)

  const { data: collections } = useCollections({
    fields: "id,title,handle",
  })

  const { data: categories } = useCategories({
    fields: "id,name,handle",
    queryParams: { parent_category_id: "null" },
  })

  // Close on route change
  useEffect(() => {
    onClose()
  }, [location.pathname, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <Link
              to="/$countryCode"
              params={{ countryCode: countryCode || "us" }}
              className="text-lg"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.15em', fontWeight: 400 }}
            >
              ESSENCE
            </Link>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-900 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto py-6">
            {/* Collections Section */}
            {collections && collections.length > 0 && (
              <div className="mb-6">
                <h3 
                  className="px-6 text-[10px] uppercase text-neutral-400 mb-3"
                  style={{ letterSpacing: '0.15em', fontWeight: 400 }}
                >
                  COLLECTIONS
                </h3>
                <nav className="space-y-0.5">
                  {collections.map((collection) => (
                    <Link
                      key={collection.id}
                      to="/$countryCode/collections/$handle"
                      params={{
                        countryCode: countryCode || "us",
                        handle: collection.handle ?? "",
                      }}
                      className="block px-6 py-2.5 text-sm text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                      style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
                    >
                      {collection.title}
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {/* Categories Section */}
            {categories && categories.length > 0 && (
              <div className="mb-6">
                <h3 
                  className="px-6 text-[10px] uppercase text-neutral-400 mb-3"
                  style={{ letterSpacing: '0.15em', fontWeight: 400 }}
                >
                  CATEGORIES
                </h3>
                <nav className="space-y-0.5">
                  <Link
                    to="/$countryCode/store"
                    params={{ countryCode: countryCode || "us" }}
                    className="block px-6 py-2.5 text-sm text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                    style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
                  >
                    All Fragrances
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to="/$countryCode/categories/$handle"
                      params={{
                        countryCode: countryCode || "us",
                        handle: category.handle ?? "",
                      }}
                      className="block px-6 py-2.5 text-sm text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                      style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {/* Additional Links */}
            <div className="border-t border-neutral-200 pt-6 mt-6">
              <nav className="space-y-0.5">
                <Link
                  to="/$countryCode/account"
                  params={{ countryCode: countryCode || "us" }}
                  className="block px-6 py-2.5 text-sm text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                  style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
                >
                  Account
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
