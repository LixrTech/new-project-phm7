import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { HttpTypes } from "@medusajs/types"
import { getActivePaymentSession } from "@/lib/utils/checkout"
import { ReactNode } from "react"

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
)

interface StripeElementsProviderProps {
  children: ReactNode;
  cart: HttpTypes.StoreCart;
}

export function StripeElementsProvider({
  children,
  cart,
}: StripeElementsProviderProps) {
  const activeSession = getActivePaymentSession(cart)
  const isStripeSelected = activeSession?.provider_id?.startsWith("pp_stripe_")
  const clientSecret = activeSession?.data?.client_secret as string | undefined

  // Only render Elements when we have a client secret
  if (!clientSecret || !isStripeSelected) {
    return <>{children}</>
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "flat",
          variables: {
            colorPrimary: "#71614e",
            colorBackground: "#ffffff",
            colorText: "#09090b",
            colorDanger: "#dc2626",
            fontFamily: 'Georgia, "Times New Roman", serif',
            spacingUnit: "4px",
            borderRadius: "4px",
          },
        },
      }}
      key={clientSecret}
    >
      {children}
    </Elements>
  )
}
