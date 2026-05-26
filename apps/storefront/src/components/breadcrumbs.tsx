import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { ChevronRight } from "@medusajs/icons"

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)

  if (items.length === 0) return null

  return (
    <nav className="py-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-xs text-neutral-600">
        {/* Home link */}
        <li>
          <Link
            to="/$countryCode"
            params={{ countryCode: countryCode || "us" }}
            className="hover:text-neutral-900 transition-colors"
          >
            Home
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`breadcrumb-${index}`} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-neutral-400" />
              {item.href && !isLast ? (
                <a
                  href={item.href.replace("$countryCode", countryCode || "us")}
                  className="hover:text-neutral-900 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className={isLast ? "text-neutral-900 font-medium" : ""}>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
