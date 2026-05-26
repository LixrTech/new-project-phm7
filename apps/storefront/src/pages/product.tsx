import ProductActions from "@/components/product-actions"
import { ImageGalleryEnhanced } from "@/components/ui/image-gallery-enhanced"
import { ProductAccordions } from "@/components/product/product-accordions"
import { RelatedProducts } from "@/components/product/related-products"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useLoaderData, useLocation } from "@tanstack/react-router"
import { useProducts } from "@/lib/hooks/use-products"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useState, useMemo, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import { Share } from "@medusajs/icons"

/**
 * Enhanced Product Page
 *
 * Features:
 * - High-res image gallery with zoom
 * - Image rollover on thumbnails
 * - Variant selection (size, color swatches)
 * - Product information accordions
 * - Related products carousel
 * - Add to cart with Quick Buy option
 */
const ProductDetails = () => {
  const { product, region } = useLoaderData({
    from: "/$countryCode/products/$handle",
  })
  
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname) || "us"

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const handleVariantChange = useCallback((_variant: HttpTypes.StoreProductVariant | undefined) => {
    // Variant tracking available for future use
  }, [])

  const handleOptionsChange = useCallback((options: Record<string, string | undefined>) => {
    // Filter out undefined values
    const definedOptions = Object.entries(options).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, string>)
    setSelectedOptions(definedOptions)
  }, [])

  const handleShare = useCallback(() => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {
        // Fallback: create a temporary input to copy
        const input = document.createElement("input")
        input.value = url
        input.style.position = "fixed"
        input.style.opacity = "0"
        document.body.appendChild(input)
        input.select()
        document.execCommand("copy")
        document.body.removeChild(input)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
  }, [])

  // Fetch related products (showing first 4 products as related)
  const { data: relatedProductsData } = useProducts({
    query_params: {
      limit: 5,
      fields: "id,title,handle,thumbnail,*variants.calculated_price",
    },
    region_id: region.id,
  })

  // Filter out current product from related products
  const relatedProducts =
    relatedProductsData?.pages
      .flatMap((page) => page.products)
      .filter((p) => p.id !== product.id)
      .slice(0, 4) || []

  // Reorder images based on selected color option
  // Images linked to variants with the selected color appear first
  const displayImages = useMemo(() => {
    const allImages = product.images || []
    
    // Find the color option
    const colorOption = product.options?.find(
      (opt: HttpTypes.StoreProductOption) => opt.title.toLowerCase() === "color"
    )
    
    if (!colorOption) {
      return allImages
    }

    const selectedColorValue = selectedOptions[colorOption.id]
    
    if (!selectedColorValue) {
      return allImages
    }

    // Find variants that match the selected color
    const matchingVariants = product.variants?.filter((variant: HttpTypes.StoreProductVariant) => {
      return variant.options?.some(
        (opt: HttpTypes.StoreProductOptionValue) => opt.option_id === colorOption.id && opt.value === selectedColorValue
      )
    }) || []

    // Get all image IDs from matching variants
    const variantImageIds = new Set(
      matchingVariants.flatMap((v: HttpTypes.StoreProductVariant) => v.images?.map((img: HttpTypes.StoreProductImage) => img.id) || [])
    )

    const variantImages = allImages.filter((img: HttpTypes.StoreProductImage) => variantImageIds.has(img.id))
    const otherImages = allImages.filter((img: HttpTypes.StoreProductImage) => !variantImageIds.has(img.id))

    return [...variantImages, ...otherImages]
  }, [product.images, product.options, product.variants, selectedOptions])

  return (
    <>
      <div className="content-container pt-20 md:pt-24 pb-12 px-4 md:px-6">
        <Breadcrumbs 
          items={[
            { label: "Shop", href: "/$countryCode/store" },
            { label: product.title || "" }
          ]}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-6 md:mt-8">
          {/* Left: Image gallery with zoom */}
          <div>
            <ImageGalleryEnhanced images={displayImages} />
          </div>

          {/* Right: Product info + variant selection */}
          <div className="flex flex-col">
            <div className="lg:sticky lg:top-32 self-start w-full">
              {/* Product name */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-display text-neutral-900 mb-4" style={{ fontWeight: 400, letterSpacing: '0.02em' }}>
                {product.title}
              </h1>

            {/* Variant selection & Add to Cart - contains price */}
            <div className="mb-8">
              <ProductActions 
                product={product} 
                region={region}
                onVariantChange={handleVariantChange}
                onOptionsChange={handleOptionsChange}
              />
            </div>

              {/* Description below the actions */}
              {product.description && (
                <div className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-neutral-200">
                  <p className="text-neutral-700 leading-relaxed text-sm md:text-base">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Product Information Accordions */}
              <ProductAccordions />

              {/* Share Product */}
              <button
                onClick={handleShare}
                className="mt-6 flex items-center gap-2 text-xs md:text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                <Share className="w-4 h-4" />
                {copied ? "Link copied!" : "Share Product"}
              </button>
            </div>
          </div>
        </div>

        {/* Free Shipping & Returns Info Box */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          <div className="bg-sand-50 p-6 md:p-8 border border-sand-200">
            <h3 className="text-base md:text-lg font-display text-neutral-900 mb-2 md:mb-3" style={{ fontWeight: 400 }}>Free Shipping</h3>
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
              Enjoy complimentary standard shipping on all orders. Your fragrances will be carefully packaged and delivered to your doorstep.
            </p>
          </div>
          <div className="bg-sand-50 p-6 md:p-8 border border-sand-200">
            <h3 className="text-base md:text-lg font-display text-neutral-900 mb-2 md:mb-3" style={{ fontWeight: 400 }}>Hassle-Free Returns</h3>
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
              Not completely satisfied? Return your items within 30 days for a full refund. Free return shipping included.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} countryCode={countryCode} />
      )}
    </>
  )
}

export default ProductDetails
