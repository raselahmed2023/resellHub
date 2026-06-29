import Link from "next/link";

const BRAND = {
  name: "ReSell Hub",
  tagline:
    "Empowering the Circular Economy through secure and sustainable commerce.",
  socials: [
    { label: "Facebook", href: "https://facebook.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Twitter", href: "https://twitter.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
};

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const CATEGORIES = [
  { label: "Electronics", href: "/products?category=Electronics" },
  { label: "Furniture", href: "/products?category=Furniture" },
  { label: "Vehicles", href: "/products?category=Vehicles" },
  { label: "Fashion", href: "/products?category=Fashion" },
  { label: "Mobile Phones", href: "/products?category=Mobile%20Phones" },
];

const CONTACT = {
  address: "Dhaka, Bangladesh",
  email: "support@resellhub.com",
  phone: "+880 1700-000000",
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 select-none w-fit">
            <span className="font-extrabold text-lg tracking-tight text-white">
              Re<span className="text-emerald-400">Sell</span>{" "}
              <span className="font-normal text-gray-400">Hub</span>
            </span>
          </Link>

          <p className="text-sm text-gray-400 leading-relaxed">
            {BRAND.tagline}
          </p>

          <div className="flex flex-wrap gap-3 mt-1">
            {BRAND.socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-gray-400 hover:text-emerald-400 border border-gray-700 hover:border-emerald-500 px-3 py-1.5 rounded-md transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
            Quick Links
          </h3>

          <ul className="flex flex-col gap-2.5">
            {QUICK_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
            Categories
          </h3>

          <ul className="flex flex-col gap-2.5">
            {CATEGORIES.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
            Contact Us
          </h3>

          <ul className="flex flex-col gap-3">
            <li className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                Address
              </span>
              <span className="text-sm text-gray-400">{CONTACT.address}</span>
            </li>

            <li className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                Email
              </span>
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
              >
                {CONTACT.email}
              </a>
            </li>

            <li className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                Phone
              </span>
              <a
                href={`tel:${CONTACT.phone}`}
                className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
              >
                {CONTACT.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {year} ReSell Hub. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="text-xs text-gray-500 hover:text-emerald-400 transition-colors"
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className="text-xs text-gray-500 hover:text-emerald-400 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}