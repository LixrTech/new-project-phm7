import { AccountDropdown } from "@/components/account-dropdown"
import { CartDropdown } from "@/components/cart"
import { PredictiveSearch } from "@/components/search/predictive-search"
import { ShopDropdown } from "@/components/shop-dropdown"
import { SideNavigation } from "@/components/side-navigation"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { Link, useLocation } from "@tanstack/react-router"
import { EllipsisHorizontal } from "@medusajs/icons"
import { useState, useEffect } from "react"

export const Navbar = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

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
      {/* Side Navigation */}
      <SideNavigation isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />

      <div className="fixed top-0 inset-x-0 z-50 bg-white">
        <header className="relative h-14 sm:h-16 border-b border-neutral-200">
          <nav className="flex items-center justify-between w-full h-full px-4 sm:px-6 lg:px-12 max-w-screen-2xl mx-auto">
            {/* Left: SHOP Button */}
            <div className="flex items-center h-full">
              {/* Desktop: SHOP Dropdown */}
              <div className="hidden lg:block">
                <ShopDropdown />
              </div>
              
              {/* Mobile: SHOP Button opens side nav */}
              <button
                onClick={() => setIsSideNavOpen(true)}
                className="lg:hidden text-[11px] sm:text-xs uppercase tracking-[0.2em] hover:text-neutral-500 transition-colors font-normal"
                aria-label="Open menu"
              >
                SHOP
              </button>
            </div>
            
            {/* Center: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link
                to="/$countryCode"
                params={{ countryCode: countryCode || "us" }}
                className="text-lg sm:text-xl font-serif hover:text-neutral-600 transition-colors"
                style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.15em', fontWeight: 400 }}
              >
                ESSENCE
              </Link>
            </div>

            {/* Right: Utility Icons */}
            <div className="flex items-center gap-3 sm:gap-4 h-full">
              {/* Search */}
              <PredictiveSearch />

              {/* Account */}
              <AccountDropdown />

              {/* Cart */}
              <CartDropdown />
            </div>
          </nav>
        </header>
      </div>
    </>
  )
}
