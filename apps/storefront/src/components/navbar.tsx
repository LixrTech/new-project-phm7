import { AccountDropdown } from "@/components/account-dropdown"
import { CartDropdown } from "@/components/cart"
import { PredictiveSearch } from "@/components/search/predictive-search"
import { ShopDropdown } from "@/components/shop-dropdown"
import { SideNavigation } from "@/components/side-navigation"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { Link, useLocation } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Navbar = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const [scrolled, setScrolled] = useState(false)
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Side Navigation */}
      <SideNavigation isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />

      <div 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
      >
        <header className="relative h-16 lg:h-20">
          <nav className="flex items-center justify-between w-full h-full px-6 sm:px-8 lg:px-16 max-w-screen-2xl mx-auto">
            {/* Left: SHOP Button */}
            <div className="flex items-center h-full min-w-[100px]">
              {/* Desktop: SHOP Dropdown */}
              <div className="hidden lg:block">
                <ShopDropdown />
              </div>
              
              {/* Mobile: SHOP Button opens side nav */}
              <button
                onClick={() => setIsSideNavOpen(true)}
                className="lg:hidden text-xs uppercase tracking-[0.25em] text-neutral-700 hover:text-neutral-900 transition-colors font-light"
                aria-label="Open menu"
              >
                MENU
              </button>
            </div>
            
            {/* Center: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link
                to="/$countryCode"
                params={{ countryCode: countryCode || "us" }}
                className="text-xl lg:text-2xl hover:text-neutral-600 transition-colors"
                style={{ 
                  fontFamily: 'Georgia, serif', 
                  letterSpacing: '0.2em', 
                  fontWeight: 300 
                }}
              >
                ESSENCE
              </Link>
            </div>

            {/* Right: Utility Icons */}
            <div className="flex items-center gap-4 lg:gap-6 h-full min-w-[100px] justify-end">
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
