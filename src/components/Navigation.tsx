import { useState, useEffect } from "react";
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
    { label: "Contact", path: "/contact" }
  ];

  const isActive = (path: string) => location.pathname === path;

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle escape key and prevent body scroll when menu is open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-primary text-white py-2 text-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
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
              <div className="hidden md:flex items-center space-x-1 text-xs">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span>23, Bolanle Awosiku Street, off Ilogbo Road, Borehole, Ota, Ogun State</span>
              </div>
            </div>
            <div className="hidden lg:block text-xs whitespace-nowrap font-medium">
              Academic Session 2025/2026 - Light to the World
            </div>
          </div>
        </div>
      </div>
      <header className="bg-background/95 backdrop-blur-sm border-b border-border shadow-sm sticky top-0 z-50 transition-all duration-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logo} alt="Our God Reigns Crystal School" className="h-10 w-10 md:h-12 md:w-12" />
              <div className="flex flex-col">
                <h1 className="text-base md:text-lg font-bold text-primary leading-tight">Our God Reigns Crystal School</h1>
                <p className="text-xs text-accent font-medium">Light to the World</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-colors hover:text-primary font-medium text-sm xl:text-base ${
                    isActive(item.path) ? "text-primary" : "text-foreground"
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
              className="lg:hidden relative z-50"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile Menu */}
            <div className="absolute top-full left-0 right-0 bg-background/98 backdrop-blur-md border-b border-border shadow-lg z-40 lg:hidden">
              <div className="container mx-auto px-4">
                <nav className="py-6">
                  <div className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`transition-all duration-200 hover:text-primary hover:translate-x-2 font-medium py-2 px-2 rounded-md hover:bg-primary/5 ${
                          isActive(item.path) 
                            ? "text-primary bg-primary/10 border-l-4 border-primary" 
                            : "text-foreground"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
};

export default Navigation;