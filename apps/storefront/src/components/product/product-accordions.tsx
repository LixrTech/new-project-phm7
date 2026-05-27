import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDown } from "@medusajs/icons"

interface AccordionItem {
  id: string
  title: string
  content: string | React.ReactNode
}

interface ProductAccordionsProps {
  items?: AccordionItem[]
}

const defaultItems: AccordionItem[] = [
  {
    id: "notes",
    title: "Fragrance Notes",
    content: (
      <div className="space-y-3">
        <div>
          <p className="font-medium text-neutral-900 mb-1">Top Notes</p>
          <p className="text-neutral-600">Bergamot, Pink Pepper, Saffron</p>
        </div>
        <div>
          <p className="font-medium text-neutral-900 mb-1">Heart Notes</p>
          <p className="text-neutral-600">Rose, Jasmine, Oud Wood</p>
        </div>
        <div>
          <p className="font-medium text-neutral-900 mb-1">Base Notes</p>
          <p className="text-neutral-600">Amber, Musk, Sandalwood, Vanilla</p>
        </div>
      </div>
    ),
  },
  {
    id: "details",
    title: "Fragrance Details",
    content: (
      <div className="space-y-2">
        <p>
          <strong>Concentration:</strong> Eau de Parfum (EDP)
        </p>
        <p>
          <strong>Longevity:</strong> 8-12 hours
        </p>
        <p>
          <strong>Sillage:</strong> Moderate to Strong
        </p>
        <p>
          <strong>Scent Family:</strong> Oriental Woody
        </p>
        <p className="text-sm text-neutral-600 mt-4">
          A luxurious blend that opens with vibrant citrus and spice, evolving into a rich floral heart with precious oud, and settling into a warm, sensual base.
        </p>
      </div>
    ),
  },
  {
    id: "ingredients",
    title: "Ingredients & Care",
    content: (
      <div className="space-y-2">
        <p>
          <strong>Key Ingredients:</strong> Natural Oud Extract, Bulgarian Rose Oil, Sandalwood Essential Oil, Pure Amber Resin
        </p>
        <p>
          <strong>Care:</strong> Store in a cool, dry place away from direct sunlight. Keep bottle tightly closed when not in use.
        </p>
        <p className="text-sm text-neutral-600">
          Crafted with ethically sourced ingredients and traditional perfumery techniques.
        </p>
      </div>
    ),
  },
  {
    id: "shipping",
    title: "Shipping & Returns",
    content: (
      <div className="space-y-2">
        <p>
          <strong>Shipping:</strong> Complimentary standard shipping on all orders. Fragrances are carefully packaged to ensure safe delivery.
        </p>
        <p>
          <strong>Returns:</strong> 30-day returns for unopened fragrances. Due to the nature of the product, opened bottles cannot be returned for hygiene reasons.
        </p>
      </div>
    ),
  },
]

export const ProductAccordions = ({ items = defaultItems }: ProductAccordionsProps) => {
  return (
    <Accordion.Root type="multiple" className="w-full">
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className="border-b border-neutral-200"
        >
          <Accordion.Trigger className="flex items-center justify-between w-full py-5 text-left group">
            <span className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
              {item.title}
            </span>
            <ChevronDown className="w-5 h-5 text-neutral-600 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Accordion.Trigger>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-open data-[state=closed]:animate-accordion-close">
            <div className="pb-6 text-sm text-neutral-700 leading-relaxed">
              {typeof item.content === "string" ? <p>{item.content}</p> : item.content}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
