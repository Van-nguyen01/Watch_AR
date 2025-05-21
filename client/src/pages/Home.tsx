import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Watch, ShoppingBag, Clock, Zap, CheckCircle } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  useAuthGuard();
  const navigate = useNavigate();

  const { data: featuredWatches, isLoading } = useQuery({
    queryKey: ['/api/watches'],
    queryFn: async () => {
      const res = await fetch('/api/watches');
      if (!res.ok) throw new Error('Failed to fetch watches');
      return res.json();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Try Watches Virtually Before You <GradientText>Buy</GradientText>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Experience the future of watch shopping with our groundbreaking AR technology. See how watches look on your wrist before making a purchase.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/shop")}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    const el = document.getElementById("how-it-works");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  How It Works
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center items-center relative">
              <div className="relative w-[350px] h-[350px] rounded-2xl overflow-hidden shadow-2xl bg-white flex items-center justify-center">
                <img 
                  src="/images/Motana.webp" 
                  alt="Watch AR Demo" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                  <Button variant="outline" size="lg" className="bg-white/80 hover:bg-white mb-2">
                    Watch Demo
                  </Button>
                  <span className="text-white text-sm">Xem thử tính năng AR trực tiếp!</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose WatchAR</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're reimagining the watch shopping experience with innovative technology and exceptional service.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Watch className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Virtual Try-On</h3>
                <p className="text-gray-600">
                  See exactly how a watch will look on your wrist using our AR technology.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Premium Collection</h3>
                <p className="text-gray-600">
                  Curated selection of luxury, sport, and casual watches from top brands.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Quick shipping and hassle-free delivery right to your doorstep.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Expert Support</h3>
                <p className="text-gray-600">
                  Dedicated watch experts available to assist with your purchase.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
              <h2 className="text-3xl font-bold">Featured Watches</h2>
              <Button variant="outline" onClick={() => navigate("/shop")}>
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-64 bg-gray-200 animate-pulse" />
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-1/2" />
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4" />
                    </div>
                  </div>
                ))
              ) : featuredWatches && featuredWatches.length > 0 ? (
                featuredWatches.slice(0, 3).map((watch: any) => (
                  <div key={watch.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                    <div className="h-64 overflow-hidden flex items-center justify-center bg-gray-50">
                      <img 
                        src={watch.imageUrl} 
                        alt={watch.name} 
                        className="max-h-56 w-auto object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-medium mb-2 line-clamp-2">{watch.name}</h3>
                      <p className="text-gray-500 mb-4">{watch.brand}</p>
                      <div className="flex justify-between items-end mt-auto">
                        <span className="text-lg font-bold">{watch.price.toLocaleString('vi-VN')} ₫</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/try-on/${watch.id}`)}
                          >
                            Try AR
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/product/${watch.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">No featured watches available</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How AR Try-On Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our innovative AR technology makes it easy to see how a watch will look on your wrist before purchasing.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md relative">
                <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                <h3 className="text-xl font-medium mb-4">Choose a Watch</h3>
                <p className="text-gray-600 mb-4">
                  Browse our collection and select a watch you'd like to try on virtually.
                </p>
                <img 
                  src="/images/step1-choose.jpg" 
                  alt="Choose a watch" 
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md relative">
                <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                <h3 className="text-xl font-medium mb-4">Launch AR View</h3>
                <p className="text-gray-600 mb-4">
                  Click the "Try AR" button to activate your device's camera for the AR experience.
                </p>
                <img 
                  src="/images/step2-ar.jpg" 
                  alt="Launch AR view" 
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md relative">
                <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
                <h3 className="text-xl font-medium mb-4">See & Purchase</h3>
                <p className="text-gray-600 mb-4">
                  View the watch on your wrist from multiple angles and complete your purchase.
                </p>
                <img 
                  src="/images/step3-purchase.jpg" 
                  alt="See and purchase" 
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it – here's what customers think about WatchAR.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex text-yellow-400 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">
                  "The AR try-on feature is incredible! I was hesitant about ordering a watch online, but being able to see it on my wrist first made all the difference."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-medium">Alex Johnson</h4>
                    <p className="text-sm text-gray-500">Verified Customer</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex text-yellow-400 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">
                  "Fast shipping and the watch looks exactly like it did in the AR try-on. This is how all online shopping should be!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-medium">Sarah Williams</h4>
                    <p className="text-sm text-gray-500">Verified Customer</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex text-yellow-400 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">
                  "I've purchased three watches from WatchAR now. The quality is excellent and the AR feature helps me make confident buying decisions."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-medium">Michael Chen</h4>
                    <p className="text-sm text-gray-500">Verified Customer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/90 to-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience AR Watch Shopping?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have found their perfect timepiece with our virtual try-on technology.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => navigate("/shop")}
              >
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 w-full sm:w-auto"
                onClick={() => navigate("/register")}
              >
                Create Account
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
