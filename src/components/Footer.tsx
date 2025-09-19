import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-navy text-navy-foreground">
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
            <p className="text-sm text-muted-foreground">
              A place for academic and moral excellence, committed to nurturing young minds with Christian values and academic excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/admissions" className="hover:text-accent transition-colors">Admissions</Link></li>
              <li><Link to="/gallery" className="hover:text-accent transition-colors">Gallery</Link></li>
              <li><Link to="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/portal/admin" className="hover:text-accent transition-colors">Admin Portal</Link></li>
              <li><Link to="/portal/staff" className="hover:text-accent transition-colors">Staff Portal</Link></li>
              <li><Link to="/portal/parent" className="hover:text-accent transition-colors">Parent Portal</Link></li>
              <li><Link to="/portal/student" className="hover:text-accent transition-colors">Student Portal</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                <p>23, Bolanle Awosika Street, off Ilogbo Road, Borehole, Ota, Ogun State</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent" />
                <p>08027625129, 08033089735</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent" />
                <p>ogrcs@yahoo.com</p>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-muted mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Our God Reigns Crystal School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;