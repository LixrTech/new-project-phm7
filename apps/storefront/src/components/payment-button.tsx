import { Button } from "@/components/ui/button"
import { useCompleteCartOrder } from "@/lib/hooks/use-checkout"
import { isManual, isStripe } from "@/lib/utils/checkout"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { HttpTypes } from "@medusajs/types"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useStripe, useElements } from "@stripe/react-stripe-js"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart;
  className?: string;
};

const PaymentButton = ({ cart, className }: PaymentButtonProps) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripe(paymentSession?.provider_id):
      return <StripePaymentButton notReady={notReady} className={className} />
    case isManual(paymentSession?.provider_id):
      return <ManualPaymentButton notReady={notReady} className={className} />
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  notReady,
  className,
}: {
  notReady: boolean;
  className?: string;
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const completeOrderMutation = useCompleteCartOrder()
  const stripe = useStripe()
  const elements = useElements()

  const handlePayment = async () => {
    if (!stripe || !elements) {
      setErrorMessage("Payment system not initialized")
      return
    }

    setErrorMessage(null)
    setLoading(true)

    try {
      // Submit the form to validate
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setErrorMessage(submitError.message || "Payment validation failed")
        setLoading(false)
        return
      }

      // Confirm the payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + `/${countryCode || "us"}/order-confirmation`,
        },
        redirect: "if_required",
      })

      if (error) {
        setErrorMessage(error.message || "Payment failed")
        setLoading(false)
        return
      }

      // Complete the order
      const order = await completeOrderMutation.mutateAsync()

      // Navigate to order confirmation
      navigate({
        to: "/$countryCode/order/$orderId/confirmed",
        params: { countryCode: countryCode || "us", orderId: order.id },
        replace: true,
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Payment failed"
      )
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        disabled={notReady || loading || completeOrderMutation.isPending}
        onClick={handlePayment}
        data-testid="place-order-button"
        className={className}
      >
        {loading || completeOrderMutation.isPending ? "Processing..." : "Place Order"}
      </Button>
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}
    </>
  )
}

const ManualPaymentButton = ({
  notReady,
  className,
}: {
  notReady: boolean;
  className?: string;
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const completeOrderMutation = useCompleteCartOrder()

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    try {
      const order = await completeOrderMutation.mutateAsync()

      // Navigate to order confirmation
      navigate({
        to: "/$countryCode/order/$orderId/confirmed",
        params: { countryCode: countryCode || "us", orderId: order.id },
        replace: true,
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to place order"
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        disabled={notReady || submitting}
        onClick={handlePayment}
        data-testid="place-order-button"
        className={className}
      >
        Place Order
      </Button>
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}
    </>
  )
}

export default PaymentButton
