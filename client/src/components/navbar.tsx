import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/store", label: "Watch Store" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Quantum
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant={location === link.href ? "default" : "ghost"}
              asChild
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        {/* Mobile navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-80">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  variant={location === link.href ? "default" : "ghost"}
                  className="justify-start"
                  asChild
                  onClick={handleLinkClick}
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
              <Separator className="my-2" />
              <Button variant="outline" className="mt-4" asChild onClick={handleLinkClick}>
                <Link href="/store">Try AR Now</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Call to action */}
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/store">Try AR Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}