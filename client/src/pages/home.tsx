import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, WatchIcon, Smartphone, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Watch } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import Footer from "@/components/footer";

export default function Home() {
  // Get featured watches (all watches for now)
  const { data: watches, isLoading } = useQuery<Watch[]>({
    queryKey: ['/api/watches'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  // Take the first 3 watches for the featured section
  const featuredWatches = watches?.slice(0, 3);
  
  return (
    <div className="flex flex-col min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 z-0"></div>
          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Try Before You Buy with{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  AR Technology
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Experience how watches look on your wrist before making a purchase decision.
                Our augmented reality technology brings the showroom experience to your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/store">
                    Explore Our Collection <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/store">Learn About AR</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Watches */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Timepieces</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our handpicked selection of premium watches, all available with our virtual try-on technology
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center">
                <p>Loading featured watches...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredWatches?.map((watch) => (
                  <Card key={watch.id} className="overflow-hidden h-full flex flex-col">
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={watch.imageUrl}
                        alt={watch.name}
                        className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                          AR Ready
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold mb-1">{watch.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{watch.brand}</p>
                      <p className="text-sm mb-4 line-clamp-2 flex-grow">{watch.description}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="font-semibold">${watch.price}</span>
                        <Button size="sm" asChild>
                          <Link href={`/watch/${watch.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link href="/store">
                  View All Watches <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How AR Try-On Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the future of online shopping with our augmented reality technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <WatchIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse Watches</h3>
                <p className="text-muted-foreground">
                  Explore our collection of premium timepieces from top brands with detailed information.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Virtual Try-On</h3>
                <p className="text-muted-foreground">
                  Use your device's camera to see how the watch looks on your wrist in real-time.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BadgeCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Make Confident Purchases</h3>
                <p className="text-muted-foreground">
                  Buy with confidence knowing exactly how the watch will look and fit on your wrist.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary/60 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Watch Shopping Experience?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Try our innovative AR technology and find your perfect timepiece today.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/store">
                  Explore Our Collection <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
