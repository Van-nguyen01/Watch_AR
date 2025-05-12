import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Menu, X, User, ShoppingCart, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = window.location.pathname;
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Try AR", href: "/shop?ar=true" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];
  
  return (
    <header className="bg-white shadow-sm relative z-10">
      <div className="container py-4 px-6 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-gray-700 hover:text-primary transition-colors",
                  { "font-medium text-primary": pathname.startsWith(item.href) }
                )}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              className="p-2 text-gray-700 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link to="/login">
              <a className="p-2 text-gray-700 hover:text-primary transition-colors">
                <User size={20} />
              </a>
            </Link>
            <Link to="/cart">
              <a className="p-2 text-gray-700 hover:text-primary transition-colors relative">
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </a>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="mr-4">
              <a className="p-2 text-gray-700 hover:text-primary transition-colors relative">
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </a>
            </Link>
            <button 
              onClick={toggleMenu}
              className="p-2 text-gray-700 hover:text-primary transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-20">
          <div className="container py-4 px-6">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link key={item.href} to={item.href} className={cn(
                  "text-gray-700 hover:text-primary transition-colors py-2", 
                  { "font-medium text-primary": pathname.startsWith(item.href) }
                )} onClick={closeMenu}>
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={closeMenu}
                  >
                    <User size={18} className="mr-2" />
                    Sign In
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}