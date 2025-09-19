import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-yellow-600 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Our God Reigns Crystal School" className="h-12 w-12" />
              <div>
                <h3 className="text-lg font-bold">Our God Reigns Crystal School</h3>
                <p className="text-accent text-sm">Light to the World</p>
              </div>
            </div>
            <p className="text-sm text-white/80">
              A place for academic and moral excellence, committed to nurturing young minds with Christian values and academic excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-300">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-yellow-300 transition-colors">About Us</Link></li>
              <li><Link to="/admissions" className="hover:text-yellow-300 transition-colors">Admissions</Link></li>
              <li><Link to="/gallery" className="hover:text-yellow-300 transition-colors">Gallery</Link></li>
              <li><Link to="/blog" className="hover:text-yellow-300 transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-300 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-300">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/portal/admin" className="hover:text-yellow-300 transition-colors">Admin Portal</Link></li>
              <li><Link to="/portal/staff" className="hover:text-yellow-300 transition-colors">Staff Portal</Link></li>
              <li><Link to="/portal/parent" className="hover:text-yellow-300 transition-colors">Parent Portal</Link></li>
              <li><Link to="/portal/student" className="hover:text-yellow-300 transition-colors">Student Portal</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-300">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-yellow-300 mt-1 flex-shrink-0" />
                <p>23, Bolanle Awosika Street, off Ilogbo Road, Borehole, Ota, Ogun State</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-yellow-300" />
                <div className="flex flex-wrap gap-1">
                  <a href="tel:+2348027625129" className="hover:text-yellow-300 transition-colors">08027625129</a>
                  <span>,</span>
                  <a href="tel:+2348033089735" className="hover:text-yellow-300 transition-colors">08033089735</a>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-yellow-300" />
                <a href="mailto:ogrcs@yahoo.com" className="hover:text-yellow-300 transition-colors">ogrcs@yahoo.com</a>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-white/70 hover:text-yellow-300 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-yellow-300 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-yellow-300 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-yellow-300 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center text-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p>&copy; 2025 Our God Reigns Crystal School. All rights reserved.</p>
            <div className="flex items-center space-x-4 text-xs">
              <span>Developed by:</span>
              <a href="tel:+2348134813380" className="text-yellow-300 hover:text-yellow-100 transition-colors">
                Jerry Emeka 08134813380
              </a>
              <span>|</span>
              <a href="https://j7hub.com/contact-us" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-100 transition-colors">
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