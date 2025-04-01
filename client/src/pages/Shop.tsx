import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Watch } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useState } from "react";

// Type for watches
type Watch = {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string;
  modelUrl: string | null;
  category: string;
  inStock: boolean;
  createdAt: string;
};

export default function Shop() {
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialCategory = urlParams.get('category') || 'all';
  
  const [category, setCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>("default");
  
  // Fetch watches with category filter
  const { data: watches, isLoading } = useQuery({
    queryKey: ['/api/watches', category],
    queryFn: async () => {
      const endpoint = category === 'all' 
        ? '/api/watches' 
        : `/api/watches?category=${category}`;
      
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to fetch watches');
      return res.json() as Promise<Watch[]>;
    }
  });

  // Sort watches based on selected option
  const sortedWatches = watches ? [...watches].sort((a, b) => {
    switch (sortBy) {
      case "price-low-to-high":
        return a.price - b.price;
      case "price-high-to-low":
        return b.price - a.price;
      case "name-a-z":
        return a.name.localeCompare(b.name);
      case "name-z-a":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  }) : [];

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    
    // Update URL without page reload
    const newParams = new URLSearchParams();
    if (value !== 'all') {
      newParams.set('category', value);
    }
    
    const newLocation = newParams.toString() 
      ? `/shop?${newParams.toString()}` 
      : '/shop';
    
    setLocation(newLocation);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container py-8">
          {/* Shop header with title and filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Watch Collection</h1>
              <p className="text-gray-600">
                Browse our collection of premium watches
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-48">
                <Select 
                  value={category} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="sport">Sport</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-48">
                <Select 
                  value={sortBy} 
                  onValueChange={setSortBy}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Featured</SelectItem>
                    <SelectItem value="price-low-to-high">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-to-low">Price: High to Low</SelectItem>
                    <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                    <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Products grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* Loading skeletons */}
              {Array(8).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-64 bg-gray-200 animate-pulse" />
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-1/2" />
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4" />
                    <div className="mt-4 h-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedWatches && sortedWatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* Product cards */}
              {sortedWatches.map((watch) => (
                <div key={watch.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={watch.imageUrl} 
                      alt={watch.name} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-medium mb-1">{watch.name}</h3>
                      <p className="text-gray-500">{watch.brand}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">${watch.price.toFixed(2)}</span>
                      <div className="flex gap-2">
                        <Link href={`/try-on/${watch.id}`}>
                          <Button size="sm" variant="outline">Try AR</Button>
                        </Link>
                        <Link href={`/product/${watch.id}`}>
                          <Button size="sm">View</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center p-6 bg-gray-100 rounded-full mb-6">
                <Watch className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">No watches found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any watches matching your criteria.
              </p>
              <Button onClick={() => handleCategoryChange('all')}>
                View All Watches
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}