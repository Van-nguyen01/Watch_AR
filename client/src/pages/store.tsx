import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Watch } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function Store() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const { data: watches, isLoading, error } = useQuery<Watch[]>({
    queryKey: ['/api/watches'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });
  
  // Filter watches based on selected category and brand
  const filteredWatches = watches?.filter((watch) => {
    if (selectedCategory && watch.category !== selectedCategory) {
      return false;
    }
    if (selectedBrand && watch.brand !== selectedBrand) {
      return false;
    }
    return true;
  });

  // Get unique categories and brands for filters
  const categories = [...new Set(watches?.map(watch => watch.category))];
  const brands = [...new Set(watches?.map(watch => watch.brand))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Quantum Watch Store</h1>
      <p className="text-xl mb-8 text-muted-foreground">
        Explore our collection of premium watches with AR try-on technology
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filter sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"} 
                className="w-full justify-start"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {categories.map(category => (
                <Button 
                  key={category} 
                  variant={selectedCategory === category ? "default" : "outline"} 
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Brands</h3>
            <div className="space-y-2">
              <Button 
                variant={selectedBrand === null ? "default" : "outline"} 
                className="w-full justify-start"
                onClick={() => setSelectedBrand(null)}
              >
                All Brands
              </Button>
              {brands.map(brand => (
                <Button 
                  key={brand} 
                  variant={selectedBrand === brand ? "default" : "outline"} 
                  className="w-full justify-start"
                  onClick={() => setSelectedBrand(brand)}
                >
                  {brand}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p>Loading watches...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-red-500">Error loading watches</p>
            </div>
          ) : filteredWatches?.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p>No watches found matching your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWatches?.map((watch) => (
                <Card key={watch.id} className="overflow-hidden flex flex-col h-full">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={watch.imageUrl}
                      alt={watch.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{watch.name}</CardTitle>
                      <Badge>{watch.category}</Badge>
                    </div>
                    <CardDescription>{watch.brand}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <p className="line-clamp-3">{watch.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-2">
                    <p className="text-lg font-semibold">${watch.price}</p>
                    <div className="space-x-2">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/try-on/${watch.id}`}>Try On</Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link to={`/watch/${watch.id}`}>Details</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}