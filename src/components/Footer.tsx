import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Our God Reigns Crystal School" className="h-12 w-12 rounded-full" />
              <div>
                <h3 className="text-lg font-heading font-bold">Our God Reigns Crystal School</h3>
                <p className="text-accent text-sm font-body">Light to the World</p>
              </div>
            </div>
            <p className="text-sm text-white/80 font-body">
              A place for academic and moral excellence, committed to nurturing young minds with Christian values and academic excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-2 text-sm font-body">
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/admissions" className="hover:text-accent transition-colors">Admissions</Link></li>
              <li><Link to="/gallery" className="hover:text-accent transition-colors">Gallery</Link></li>
              <li><Link to="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4 text-accent">Portals</h4>
            <ul className="space-y-2 text-sm font-body">
              <li><Link to="/portals/admin" className="hover:text-accent transition-colors">Admin Portal</Link></li>
              <li><a href="https://ogrcs.edutams.net/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Staff Portal</a></li>
              <li><a href="https://ogrcs.edutams.net/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Parent Portal</a></li>
              <li><a href="https://ogrcs.edutams.net/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Student Portal</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4 text-accent">Contact Us</h4>
            <div className="space-y-3 text-sm font-body">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                <p>23, Bolanle Awosika Street, off Ilogbo Road, Borehole, Ota, Ogun State</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent" />
                <div className="flex flex-wrap gap-1">
                  <a href="tel:+2348027625129" className="hover:text-accent transition-colors">08027625129</a>
                  <span>,</span>
                  <a href="tel:+2348033089735" className="hover:text-accent transition-colors">08033089735</a>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:ogrcs@yahoo.com" className="hover:text-accent transition-colors">ogrcs@yahoo.com</a>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a href="https://www.facebook.com/profile.php?id=100064995772701" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <Link to="/" className="text-white/70 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="/" className="text-white/70 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link to="/" className="text-white/70 hover:text-accent transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center text-sm font-body">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p>&copy; 2025 Our God Reigns Crystal School. All rights reserved.</p>
            <div className="flex items-center space-x-4 text-xs">
              <span>Developed by:</span>
              <a href="tel:+2348134813380" className="text-accent hover:text-accent/80 transition-colors">
                Jerry Emeka 08134813380
              </a>
              <span>|</span>
              <a href="https://j7hub.com/contact-us" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
                j7hub.com/contact-us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;