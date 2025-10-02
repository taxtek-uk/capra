import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Search,
  Globe,
  Star,
  Award,
} from "lucide-react";
import { Container } from "./Container";
import { siteConfig } from "@/data/site";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm py-2 hidden md:block">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Premium Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Shipping Worldwide</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>50,000+ Happy Customers</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="tel:+1234567890" 
                className="hover:text-blue-200 transition-colors flex items-center gap-1"
              >
                <Phone className="w-4 h-4" />
                {siteConfig.contact.phone}
              </a>
              <div className="w-px h-4 bg-white/30"></div>
              <a 
                href="mailto:info@capra.com" 
                className="hover:text-blue-200 transition-colors"
              >
                info@capra.pk
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Header */}
      <header
        className={`fixed pt-1 top-0 md:top-8 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg h-16 md:h-18"
            : "bg-white/90 backdrop-blur-sm h-16 md:h-18"
        }`}
      >
        <Container>
          <div className="flex items-center h-full">
           {/* Logo Section */}
            <div className="flex-1">
              <Link
                to="/"
                className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105"
              >
                {/* Logo Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src="/images/capra-logo.png"
                    alt="CAPRA Logo"
                    className="w-12 h-12 object-contain"
                  />
                </div>

                {/* Logo Text */}
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text font-heading">
                    CAPRA
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:block font-medium">
                    {siteConfig.tagline}
                  </span>
                </div>
              </Link>
            </div>


            {/* Navigation Section - Centered */}
            <div className="flex-1 flex justify-center">
              <nav className="hidden lg:flex items-center gap-8">
              {siteConfig.navigation.map((item) =>
                item.children ? (
                  <div key={item.name} className="relative group">
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50 group"
                      aria-haspopup="true"
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                    </button>
                    
                    {/* Enhanced Dropdown */}
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                      <div className="p-2">
                        {item.children.map((child, index) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-xl transition-all duration-200 group/item"
                          >
                            <span className="font-medium">{child.name}</span>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:text-blue-600 group-hover/item:translate-x-1 transition-all duration-200" />
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-2xl">
                        <p className="text-xs text-gray-600 text-center">
                          Explore our premium collection
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg relative group ${
                      location.pathname === item.href
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {item.name}
                    {location.pathname === item.href && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                    )}
                  </Link>
                )
              )}
              </nav>
            </div>

            {/* Actions Section */}
            <div className="flex-1 flex justify-end">
              <div className="flex items-center gap-3">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              

              {/* WhatsApp Button */}
              <a
                href={siteConfig.social.whatsapp}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-green-500/25 hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 group"
              >
                <MessageSquare className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                WhatsApp
              </a>

              {/* Contact Button */}
              <Link
                to="/contact"
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 group"
              >
                <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Contact
              </Link>

              {/* Enhanced Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className="lg:hidden relative p-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
              >
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute top-1 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                      isOpen ? "rotate-45 top-2.5" : ""
                    }`}
                  />
                  <span
                    className={`absolute top-2.5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                      isOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`absolute top-4 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                      isOpen ? "-rotate-45 top-2.5" : ""
                    }`}
                  />
                </div>
              </button>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Enhanced Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-500 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
                <img src="/images/capra-logo.png" alt="CAPRA Logo" className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-gray-900">CAPRA Menu</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Content */}
          <nav className="px-6 py-6 space-y-2 overflow-y-auto h-full pb-32">
            {siteConfig.navigation.map((item) => (
              <div key={item.name} className="space-y-1">
                {item.children ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(item.name)}
                      className="flex items-center justify-between w-full py-3 px-4 text-gray-700 font-semibold hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300 group"
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          activeDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        activeDropdown === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-6 space-y-1 border-l-2 border-blue-100 ml-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block py-2 px-4 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                            onClick={() => setIsOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={`block py-3 px-4 font-semibold rounded-xl transition-all duration-300 ${
                      location.pathname === item.href
                        ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Action Buttons */}
            <div className="pt-6 space-y-3 border-t border-gray-100 mt-6">
              <a
                href={siteConfig.social.whatsapp}
                className="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5" />
                Chat on WhatsApp
              </a>
              <Link
                to="/contact"
                className="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                <Phone className="w-5 h-5" />
                Contact Sales
              </Link>
            </div>

            {/* Mobile Contact Info */}
            <div className="pt-6 space-y-3 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                <p className="font-semibold text-gray-900 mb-2">Get in Touch</p>
                <p className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4" />
                  +1 (234) 567-8900
                </p>
                <p className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  info@capra.com
                </p>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-4 p-6 border-b border-gray-100">
              <Search className="w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, categories..."
                className="flex-1 text-lg outline-none"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center">Start typing to search...</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
