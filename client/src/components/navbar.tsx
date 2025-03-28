import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                  <path d="M13 7h-2v6h6v-2h-4z"/>
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Quantum</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-gray-600 hover:text-gray-900 font-medium transition duration-150 ease-in-out"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="text-gray-600 hover:text-gray-900 font-medium transition duration-150 ease-in-out"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="text-gray-600 hover:text-gray-900 font-medium transition duration-150 ease-in-out"
            >
              FAQ
            </button>
          </nav>
          <div>
            <Button
              onClick={() => scrollToSection('waitlist')}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              Join Waitlist
            </Button>
          </div>
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            onClick={toggleMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={`md:hidden bg-white border-b border-gray-100 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <button
            onClick={() => scrollToSection('features')}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
          >
            FAQ
          </button>
        </div>
      </div>
    </header>
  );
}
