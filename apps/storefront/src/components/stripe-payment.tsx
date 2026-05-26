import { PaymentElement } from "@stripe/react-stripe-js"
import { HttpTypes } from "@medusajs/types"
import { getActivePaymentSession } from "@/lib/utils/checkout"

interface StripePaymentProps {
  cart: HttpTypes.StoreCart;
  onPaymentDetailsComplete: (complete: boolean) => void;
}

const StripePayment = ({ cart, onPaymentDetailsComplete }: StripePaymentProps) => {
  const activeSession = getActivePaymentSession(cart)
  const clientSecret = activeSession?.data?.client_secret as string | undefined

  if (!activeSession || !clientSecret) {
    return (
      <div className="text-sm text-neutral-600">
        Initializing payment...
      </div>
    )
  }

  if (!activeSession.provider_id.startsWith("pp_stripe_")) {
    return (
      <div className="text-sm text-rose-600">
        Unsupported payment provider
      </div>
    )
  }

  return (
    <div className="my-4">
      <p className="text-base font-semibold text-zinc-900 mb-4">
        Enter your card details:
      </p>
      <PaymentElement
        onChange={(e) => {
          onPaymentDetailsComplete(e.complete)
        }}
        options={{
          layout: "tabs",
        }}
      />
    </div>
  )
}

export default StripePayment
