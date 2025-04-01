import { Logo } from "@/components/Logo";
import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo and About */}
          <div>
            <Logo className="text-white mb-4" />
            <p className="text-gray-400 mb-6">
              Experience the future of watch shopping with AR technology that lets you try before you buy.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop">
                  <a className="text-gray-400 hover:text-white transition-colors">Shop</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-white transition-colors">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-gray-400 hover:text-white transition-colors">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-400 hover:text-white transition-colors">Contact</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-gray-400 hover:text-white transition-colors">FAQ</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 text-gray-400" />
                <span className="text-gray-400">123 Watch Street, City, Country</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-gray-400" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-gray-400" />
                <a href="mailto:info@watchar.com" className="text-gray-400 hover:text-white transition-colors">
                  info@watchar.com
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-medium mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} WatchAR. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm">
            <Link href="/terms">
              <a className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
            </Link>
            <Link href="/privacy">
              <a className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}