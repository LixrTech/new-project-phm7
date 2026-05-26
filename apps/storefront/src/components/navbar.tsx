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

      <div 
        className={`fixed top-0 inset-x-0 z-50 bg-white isolate transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <header className="relative h-16 mx-auto border-b border-neutral-200">
          <nav className="content-container flex items-center justify-between w-full h-full relative">
            {/* Left: SHOP Dropdown (Desktop) / Hamburger (Mobile) */}
            <div className="flex items-center gap-x-8 h-full">
              {/* Desktop: SHOP Dropdown */}
              <div className="hidden lg:block">
                <ShopDropdown />
              </div>
              
              {/* Mobile: Hamburger Menu */}
              <button
                onClick={() => setIsSideNavOpen(true)}
                className="lg:hidden text-xs uppercase tracking-wider hover:text-neutral-500 transition-colors font-medium"
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
                className="text-xl md:text-2xl font-display hover:text-neutral-600 transition-colors tracking-wider"
                style={{ fontWeight: 400, letterSpacing: '0.15em' }}
              >
                ESSENCE
              </Link>
            </div>

            {/* Right: Utility Icons */}
            <div className="flex items-center gap-x-4 md:gap-x-6 h-full">
              {/* Search */}
              <PredictiveSearch />

              {/* Account - Hide on small mobile */}
              <div className="hidden sm:block">
                <AccountDropdown />
              </div>

              {/* Cart */}
              <CartDropdown />

              {/* Mobile Menu Icon (Extra Options) */}
              <button
                onClick={() => setIsSideNavOpen(true)}
                className="lg:hidden text-neutral-700 hover:text-neutral-900"
                aria-label="Open menu"
              >
                <EllipsisHorizontal className="w-6 h-6" />
              </button>
            </div>
          </nav>
        </header>
      </div>
    </>
  )
}
