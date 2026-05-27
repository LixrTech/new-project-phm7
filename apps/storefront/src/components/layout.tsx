import ErrorBoundary from "@/components/error-boundary"
import Footer from "@/components/footer"
import { Navbar } from "@/components/navbar"
import PromoBanner from "@/components/promo-banner"
import { CartProvider } from "@/lib/context/cart"
import { ToastProvider } from "@/lib/context/toast-context"
import { Outlet } from "@tanstack/react-router"

const Layout = () => {
  return (
    <ToastProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <PromoBanner />
          <Navbar />

          <main className="relative flex-1 z-0">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>

          <Footer />
        </div>
      </CartProvider>
    </ToastProvider>
  )
}

export default Layout
