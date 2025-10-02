import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, MapPin, ChevronDown, Shield, Users, Heart, BookOpen } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isPortalsDropdownOpen, setIsPortalsDropdownOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { label: "Home", path: "/" },
    { 
      label: "About", 
      path: "/about",
      hasDropdown: true,
      subItems: [
        { label: "About Us", path: "/about" },
        { label: "Achievements", path: "/gallery" },
        { label: "School Fees", path: "/school-fees" }
      ]
    },
    { label: "Admissions", path: "/admissions" },
    { label: "Library", path: "/library" },
    { label: "E-Learning", path: "/e-learning" },
    { 
      label: "Portals", 
      path: "#",
      hasDropdown: true,
      isPortalsDropdown: true,
      subItems: [
        { label: "Admin Portal", path: "/portals/admin", icon: Shield },
        { label: "Staff Portal", path: "https://ogrcs.edutams.net/", icon: Users, isExternal: true },
        { label: "Parent Portal", path: "https://ogrcs.edutams.net/", icon: Heart, isExternal: true },
        { label: "Student Portal", path: "https://ogrcs.edutams.net/", icon: BookOpen, isExternal: true }
      ]
    },
    { label: "Gallery", path: "/gallery" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" }
  ];
  
  const isActive = (path: string) => location.pathname === path;
  return <>
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
                <span>23, Bolanle Awosika Street, off Ilogbo Road, Borehole, Ota, Ogun State</span>
              </div>
            </div>
            <div className="hidden lg:block text-xs whitespace-nowrap font-medium">
              Academic Session 2025/2026 - Light to the World
            </div>
          </div>
        </div>
      </div>
      <header className="bg-background border-b border-border shadow-soft">
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
            {navItems.map(item => (
              item.hasDropdown ? (
                <div 
                  key={item.path}
                  className="relative"
                  onMouseEnter={() => item.isPortalsDropdown ? setIsPortalsDropdownOpen(true) : setIsAboutDropdownOpen(true)}
                  onMouseLeave={() => item.isPortalsDropdown ? setIsPortalsDropdownOpen(false) : setIsAboutDropdownOpen(false)}
                >
                  {item.path === "#" ? (
                    <div 
                      className={`flex items-center space-x-1 transition-colors hover:text-primary font-medium text-sm xl:text-base cursor-pointer ${
                        item.subItems?.some(sub => isActive(sub.path)) ? "text-primary" : "text-foreground"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  ) : (
                    <Link 
                      to={item.path}
                      className={`flex items-center space-x-1 transition-colors hover:text-primary font-medium text-sm xl:text-base ${
                        isActive(item.path) || item.subItems?.some(sub => isActive(sub.path)) ? "text-primary" : "text-foreground"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Link>
                  )}
                  
                  {/* Dropdown Menu */}
                  {((item.isPortalsDropdown && isPortalsDropdownOpen) || (!item.isPortalsDropdown && isAboutDropdownOpen)) && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-elegant z-50">
                      {item.subItems?.map(subItem => {
                        const Icon = subItem.icon;
                        return subItem.isExternal ? (
                          <a
                            key={subItem.path}
                            href={subItem.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-3 text-sm transition-colors hover:bg-muted hover:text-primary rounded-lg text-foreground"
                          >
                            {Icon && <Icon className="h-4 w-4 mr-2" />}
                            {subItem.label}
                          </a>
                        ) : (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center px-4 py-3 text-sm transition-colors hover:bg-muted hover:text-primary rounded-lg ${
                              isActive(subItem.path) ? "text-primary bg-muted" : "text-foreground"
                            }`}
                          >
                            {Icon && <Icon className="h-4 w-4 mr-2" />}
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`transition-colors hover:text-primary font-medium text-sm xl:text-base ${
                    isActive(item.path) ? "text-primary" : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden pb-6 border-t border-border mt-4 pt-4">
            <div className="flex flex-col space-y-4">
              {navItems.map(item => (
                item.hasDropdown ? (
                  <div key={item.path} className="space-y-2">
                    {item.path === "#" ? (
                      <div 
                        className={`flex items-center justify-between transition-colors hover:text-primary font-medium ${
                          item.subItems?.some(sub => isActive(sub.path)) ? "text-primary" : "text-foreground"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    ) : (
                      <Link 
                        to={item.path}
                        className={`flex items-center justify-between transition-colors hover:text-primary font-medium ${
                          isActive(item.path) || item.subItems?.some(sub => isActive(sub.path)) ? "text-primary" : "text-foreground"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Link>
                    )}
                    <div className="pl-4 space-y-2 border-l-2 border-border">
                      {item.subItems?.map(subItem => {
                        const Icon = subItem.icon;
                        return subItem.isExternal ? (
                          <a
                            key={subItem.path}
                            href={subItem.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm transition-colors hover:text-primary text-muted-foreground"
                            onClick={() => setIsOpen(false)}
                          >
                            {Icon && <Icon className="h-4 w-4 mr-2" />}
                            {subItem.label}
                          </a>
                        ) : (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center text-sm transition-colors hover:text-primary ${
                              isActive(subItem.path) ? "text-primary" : "text-muted-foreground"
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            {Icon && <Icon className="h-4 w-4 mr-2" />}
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    className={`transition-colors hover:text-primary font-medium ${
                      isActive(item.path) ? "text-primary" : "text-foreground"
                    }`} 
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
    </>;
};
export default Navigation;