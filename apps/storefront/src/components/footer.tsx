import CountrySelect from "@/components/country-select"
import { useCategories } from "@/lib/hooks/use-categories"
import { useRegions } from "@/lib/hooks/use-regions"
import { useStorefrontSettings } from "@/lib/hooks/use-storefront-settings"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { Link, useLocation } from "@tanstack/react-router"

const Footer = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""
  const { settings } = useStorefrontSettings()

  const { data: categories } = useCategories({
    fields: "name,handle",
    queryParams: {
      parent_category_id: "null",
      limit: 5,
    },
  })

  const { data: regions } = useRegions({
    fields: "id, currency_code, *countries",
  })

  return (
    <footer
      className="w-full"
      style={{ backgroundColor: '#2b2621', color: '#ffffff' }}
      data-testid="footer"
    >
      <div className="content-container flex flex-col w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-y-6">
            <Link
              to={baseHref || "/"}
              className="text-2xl font-display hover:opacity-80 transition-opacity w-fit tracking-wider"
              style={{ fontWeight: 400, letterSpacing: '0.15em' }}
            >
              ESSENCE
            </Link>
            <p className="text-neutral-300 max-w-sm text-sm leading-relaxed">
              {settings.footer.brandTagline}
            </p>
          </div>

          {/* Collections Column */}
          <FooterColumn
            title="COLLECTIONS"
            links={settings.footer.collectionsLinks.map((link: { label: string; url: string }) => ({
              name: link.label,
              url: link.url.startsWith("/") ? `${baseHref}${link.url}` : link.url,
              isExternal: false,
            }))}
          />

          {/* About Column */}
          <FooterColumn
            title="ABOUT"
            links={settings.footer.aboutLinks.map((link: { label: string; url: string }) => ({
              name: link.label,
              url: link.url.startsWith("/") ? `${baseHref}${link.url}` : link.url,
              isExternal: false,
            }))}
          />
        </div>

        {/* Bottom Section */}
        <div className="border-t py-8" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-4 w-full md:w-auto">
              {/* Copyright */}
              <span className="text-xs text-neutral-400">
                © {new Date().getFullYear()} Elaf. All rights reserved.
              </span>
              
              {/* Region/Country Selector */}
              {regions && regions.length > 0 && (
                <div className="w-full md:w-64">
                  <CountrySelect regions={regions} className="bg-transparent border-white/20 hover:border-white/40" />
                </div>
              )}
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-xs">
              <a
                href={`${baseHref}/privacy`}
                className="text-neutral-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href={`${baseHref}/terms`}
                className="text-neutral-300 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

const FooterColumn = ({
  title,
  links,
}: {
  title: string
  links: {
    name: string
    url: string
    isExternal: boolean
  }[]
}) => {
  return (
    <div className="flex flex-col gap-y-6">
      <h3 className="text-white text-xs font-medium uppercase tracking-wider">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.url || link.name} className="text-sm">
            {link.isExternal ? (
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-neutral-300 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link
                to={link.url}
                className="text-neutral-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Footer
