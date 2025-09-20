import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Admissions", path: "/admissions" },
    { label: "Library", path: "/library" },
    { label: "E-Learning", path: "/e-learning" },
    { label: "School Fees", path: "/school-fees" },
    { label: "Portals", path: "/portals" },
    { label: "Gallery", path: "/gallery" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
    { label: "Login", path: "/auth" }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-primary text-white py-2 text-sm overflow-x-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <a href="tel:+2348027625129" className="flex items-center space-x-1 hover:text-accent transition-colors whitespace-nowrap">
                <Phone className="h-3 w-3" />
                <span className="text-xs sm:text-sm">+234 802 762 5129</span>
              </a>
              <a href="tel:+2348033089735" className="flex items-center space-x-1 hover:text-accent transition-colors whitespace-nowrap">
                <Phone className="h-3 w-3" />
                <span className="text-xs sm:text-sm">+234 803 308 9735</span>
              </a>
              <a href="mailto:ogrcs@yahoo.com" className="flex items-center space-x-1 hover:text-accent transition-colors whitespace-nowrap">
                <Mail className="h-3 w-3" />
                <span className="text-xs sm:text-sm">ogrcs@yahoo.com</span>
              </a>
              <div className="flex items-center space-x-1 text-xs">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="sm:hidden">Ota, Ogun State</span>
                <span className="hidden sm:inline">23, Bolanle Awosiku Street, off Ilogbo Road, Borehole, Ota, Ogun State</span>
              </div>
            </div>
            <div className="hidden lg:block text-xs whitespace-nowrap">
              Academic Session 2025/2026 - Light to the World
            </div>
          </div>
        </div>
      </div>
      <header className="bg-background border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="Our God Reigns Crystal School" className="h-12 w-12" />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-primary">Our God Reigns Crystal School</h1>
              <p className="text-xs text-accent font-medium">Light to the World</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary font-medium" : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden pb-6 border-t border-border mt-4 pt-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-colors hover:text-primary ${
                    isActive(item.path) ? "text-primary font-medium" : "text-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
    </>
  );
};

export default Navigation;