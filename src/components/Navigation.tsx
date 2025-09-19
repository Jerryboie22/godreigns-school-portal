import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
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
    { label: "Gallery", path: "/gallery" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-background border-b border-border shadow-soft sticky top-0 z-50">
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
  );
};

export default Navigation;