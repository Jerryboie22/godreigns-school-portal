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
      {/* Top Contact Bar with Gradient */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary to-primary/10 text-foreground py-3 text-sm border-b border-primary/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <a href="tel:+2348027625129" className="flex items-center space-x-2 hover:text-primary transition-all hover:scale-105 whitespace-nowrap group">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium">+234 802 762 5129</span>
              </a>
              <a href="tel:+2348033089735" className="flex items-center space-x-2 hover:text-primary transition-all hover:scale-105 whitespace-nowrap group">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium">+234 803 308 9735</span>
              </a>
              <a href="mailto:ogrcs@yahoo.com" className="flex items-center space-x-2 hover:text-primary transition-all hover:scale-105 whitespace-nowrap group">
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Mail className="h-3.5 w-3.5 text-accent" />
                </div>
                <span className="text-xs sm:text-sm font-medium">ogrcs@yahoo.com</span>
              </a>
              <div className="hidden md:flex items-center space-x-2 text-xs">
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                </div>
                <span className="font-medium">23, Bolanle Awosika Street, off Ilogbo Road, Borehole, Ota, Ogun State</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-2 text-xs whitespace-nowrap">
              <div className="px-4 py-1.5 bg-accent/20 rounded-full font-bold text-accent">
                Academic Session 2025/2026 - Light to the World
              </div>
            </div>
          </div>
        </div>
      </div>
      <header className="bg-background/95 backdrop-blur-sm border-b-2 border-primary/20 shadow-elegant sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-primary rounded-full opacity-50 group-hover:opacity-75 transition-opacity blur"></div>
              <img src={logo} alt="Our God Reigns Crystal School" className="relative h-12 w-12 md:h-16 md:w-16 rounded-full border-2 border-primary shadow-lg" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base md:text-xl font-black bg-gradient-to-r from-primary via-navy to-primary bg-clip-text text-transparent leading-tight">
                Our God Reigns Crystal School
              </h1>
              <p className="text-xs md:text-sm text-accent font-bold flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                Light to the World
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
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
                      className={`flex items-center space-x-1 transition-all px-4 py-2 rounded-xl font-semibold text-sm xl:text-base cursor-pointer ${
                        item.subItems?.some(sub => isActive(sub.path)) 
                          ? "bg-primary/10 text-primary" 
                          : "text-foreground hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <Link 
                      to={item.path}
                      className={`flex items-center space-x-1 transition-all px-4 py-2 rounded-xl font-semibold text-sm xl:text-base ${
                        isActive(item.path) || item.subItems?.some(sub => isActive(sub.path)) 
                          ? "bg-primary/10 text-primary" 
                          : "text-foreground hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="h-3.5 w-3.5" />
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
                  className={`transition-all px-4 py-2 rounded-xl font-semibold text-sm xl:text-base ${
                    isActive(item.path) 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden hover:bg-primary/10 rounded-xl" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
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