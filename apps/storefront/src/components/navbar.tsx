import { AccountDropdown } from "@/components/account-dropdown"
import { CartDropdown } from "@/components/cart"
import { PredictiveSearch } from "@/components/search/predictive-search"
import { ShopDropdown } from "@/components/shop-dropdown"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useCategories } from "@/lib/hooks/use-categories"
import { useCollections } from "@/lib/hooks/use-collections"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { Link, useLocation } from "@tanstack/react-router"
import { EllipsisHorizontal } from "@medusajs/icons"
import { useState, useEffect } from "react"

export const Navbar = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const { data: topLevelCategories } = useCategories({
    fields: "id,name,handle,parent_category_id,category_children.*",
    queryParams: { parent_category_id: "null" },
  })

  const { data: collections } = useCollections({
    fields: "id,title,handle",
  })

  const topsCategory = topLevelCategories?.find((cat) => cat.handle === "tops")
  const bottomsCategory = topLevelCategories?.find((cat) => cat.handle === "bottoms")

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <>
      <div 
        className={`fixed top-0 inset-x-0 z-50 bg-white isolate transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <header className="relative h-16 mx-auto border-b border-neutral-200">
          <nav className="content-container flex items-center justify-between w-full h-full relative">
            {/* Left: SHOP Dropdown */}
            <div className="flex items-center gap-x-8 h-full">
              <ShopDropdown />
            </div>
            
            {/* Center: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link
                to="/$countryCode"
                params={{ countryCode: countryCode || "us" }}
                className="text-2xl font-display hover:text-neutral-600 transition-colors tracking-wider"
                style={{ fontWeight: 400, letterSpacing: '0.15em' }}
              >
                ESSENCE
              </Link>
            </div>

            {/* Right: Utility Icons */}
            <div className="flex items-center gap-x-6 h-full">
              {/* Search */}
              <PredictiveSearch />

              {/* Account */}
              <AccountDropdown />

              {/* Cart */}
              <CartDropdown />

              {/* Mobile Menu */}
              <Drawer>
                <DrawerTrigger className="lg:hidden text-neutral-700 hover:text-neutral-900">
                  <EllipsisHorizontal className="w-6 h-6" />
                </DrawerTrigger>
                <DrawerContent side="left">
                  <DrawerHeader>
                    <DrawerTitle className="uppercase font-display text-lg tracking-wider">Menu</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex flex-col py-4">
                    {/* Shop All */}
                    <DrawerClose asChild>
                      <Link
                        to="/$countryCode/store"
                        params={{ countryCode: countryCode || "us" }}
                        className="px-6 py-4 text-neutral-900 text-base font-medium uppercase tracking-wide hover:bg-sand-50"
                      >
                        Shop All
                      </Link>
                    </DrawerClose>

                    {/* Tops */}
                    {topsCategory && (
                      <>
                        <div className="px-6 py-4 text-neutral-900 text-base font-semibold uppercase tracking-wide">
                          Tops
                        </div>
                        <div className="flex flex-col">
                          <DrawerClose asChild>
                            <Link
                              to="/$countryCode/categories/$handle"
                              params={{ countryCode: countryCode || "us", handle: topsCategory.handle }}
                              className="px-10 py-3 text-neutral-600 hover:bg-sand-50 transition-colors font-medium"
                            >
                              All Tops
                            </Link>
                          </DrawerClose>
                          {topsCategory.category_children?.map((subcategory) => (
                            <DrawerClose key={subcategory.id} asChild>
                              <Link
                                to="/$countryCode/categories/$handle"
                                params={{ countryCode: countryCode || "us", handle: subcategory.handle }}
                                className="px-10 py-3 text-neutral-600 hover:bg-sand-50 transition-colors"
                              >
                                {subcategory.name}
                              </Link>
                            </DrawerClose>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Bottoms */}
                    {bottomsCategory && (
                      <>
                        <div className="px-6 py-4 text-neutral-900 text-base font-semibold uppercase tracking-wide">
                          Bottoms
                        </div>
                        <div className="flex flex-col">
                          <DrawerClose asChild>
                            <Link
                              to="/$countryCode/categories/$handle"
                              params={{ countryCode: countryCode || "us", handle: bottomsCategory.handle }}
                              className="px-10 py-3 text-neutral-600 hover:bg-sand-50 transition-colors font-medium"
                            >
                              All Bottoms
                            </Link>
                          </DrawerClose>
                          {bottomsCategory.category_children?.map((subcategory) => (
                            <DrawerClose key={subcategory.id} asChild>
                              <Link
                                to="/$countryCode/categories/$handle"
                                params={{ countryCode: countryCode || "us", handle: subcategory.handle }}
                                className="px-10 py-3 text-neutral-600 hover:bg-sand-50 transition-colors"
                              >
                                {subcategory.name}
                              </Link>
                            </DrawerClose>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Collections */}
                    {collections && collections.length > 0 && (
                      <>
                        <div className="px-6 py-4 text-neutral-900 text-base font-semibold uppercase tracking-wide">
                          Collections
                        </div>
                        <div className="flex flex-col">
                          {collections.map((collection) => (
                            <DrawerClose key={collection.id} asChild>
                              <Link
                                to="/$countryCode/collections/$handle"
                                params={{ countryCode: countryCode || "us", handle: collection.handle }}
                                className="px-10 py-3 text-neutral-600 hover:bg-sand-50 transition-colors"
                              >
                                {collection.title}
                              </Link>
                            </DrawerClose>
                          ))}
                        </div>
                      </>
                    )}

                    {/* About */}
                    <DrawerClose asChild>
                      <a
                        href={`${baseHref}/about`}
                        className="px-6 py-4 text-neutral-900 text-base font-medium uppercase tracking-wide hover:bg-sand-50"
                      >
                        About
                      </a>
                    </DrawerClose>

                    {/* Account */}
                    <DrawerClose asChild>
                      <a
                        href={`${baseHref}/account`}
                        className="px-6 py-4 text-neutral-900 text-base font-medium uppercase tracking-wide hover:bg-sand-50"
                      >
                        Account
                      </a>
                    </DrawerClose>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </nav>
        </header>
      </div>
    </>
  )
}
