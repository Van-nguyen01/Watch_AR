import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Watch, Sliders, Eye, ChevronsUpDown, X, Smartphone, Check } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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

// AR preview component
function ARPreview({ watch }: { watch: Watch }) {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Start AR preview
  const startARPreview = async () => {
    try {
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      videoRef.current.srcObject = stream;
      setIsActive(true);
      
      toast({
        title: "AR Preview Started",
        description: "Position your wrist in front of the camera",
      });
      
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use AR features",
        variant: "destructive",
      });
    }
  };
  
  // Stop AR preview
  const stopARPreview = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
    }
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      stopARPreview();
    };
  }, []);
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          size="sm" 
          variant="outline"
          className="bg-white/90 backdrop-blur-sm border-primary/20 text-primary hover:bg-primary/10"
        >
          <Smartphone className="mr-2 h-4 w-4" />
          Quick AR
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] sm:max-w-none">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            AR Preview: {watch.name}
          </SheetTitle>
          <SheetDescription>
            See how this watch looks on your wrist using AR technology
          </SheetDescription>
        </SheetHeader>
        
        <div className="relative h-[calc(100%-120px)] w-full bg-black rounded-lg overflow-hidden">
          {!isActive ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
              <img 
                src={watch.imageUrl}
                alt={watch.name}
                className="h-32 w-32 object-contain mb-6"
              />
              <h3 className="text-xl font-medium mb-2">{watch.name}</h3>
              <p className="text-gray-300 mb-6">
                Experience how this watch looks on your wrist with our AR technology.
                Press the button below to start your camera.
              </p>
              <Button onClick={startARPreview} className="bg-primary hover:bg-primary/90">
                <Smartphone className="mr-2 h-5 w-5" />
                Start AR Preview
              </Button>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="h-full w-full object-cover"
              />
              <canvas 
                ref={canvasRef} 
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
              
              {/* Virtual watch overlay */}
              <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 pointer-events-none">
                <img 
                  src={watch.imageUrl}
                  alt={watch.name}
                  className="h-24 w-24 object-contain"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
                />
              </div>
              
              {/* Controls */}
              <div className="absolute bottom-4 left-0 w-full p-4 flex justify-center">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={stopARPreview}
                    className="bg-white/20 backdrop-blur-sm text-white border-white/20"
                  >
                    Stop AR
                  </Button>
                  
                  <Link href={`/try-on/${watch.id}`}>
                    <Button>
                      Full AR Experience
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-between mt-4">
          <div>
            <div className="text-lg font-bold">${watch.price.toFixed(2)}</div>
            <div className="text-sm text-gray-500">{watch.brand}</div>
          </div>
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
            <Link href={`/product/${watch.id}`}>
              <Button>View Details</Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Product card component
function ProductCard({ watch }: { watch: Watch }) {
  const [showQuickAR, setShowQuickAR] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group"
      onMouseEnter={() => setShowQuickAR(true)}
      onMouseLeave={() => setShowQuickAR(false)}
    >
      <div className="h-64 overflow-hidden relative">
        <img 
          src={watch.imageUrl} 
          alt={watch.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* AR quick preview button */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity",
          showQuickAR ? "opacity-100" : "opacity-0"
        )}>
          <ARPreview watch={watch} />
        </div>
        
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="capitalize bg-white/80 backdrop-blur-sm">
            {watch.category}
          </Badge>
        </div>
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
  );
}

// Main Shop component
export default function Shop() {
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialCategory = urlParams.get('category') || 'all';
  const { toast } = useToast();
  
  // Filter states
  const [category, setCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [arModelsOnly, setArModelsOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Fetch watches
  const { data: watches, isLoading } = useQuery({
    queryKey: ['/api/watches'],
    queryFn: async () => {
      const res = await fetch('/api/watches');
      if (!res.ok) throw new Error('Failed to fetch watches');
      return res.json() as Promise<Watch[]>;
    }
  });
  
  // Extract unique brands from watches
  const availableBrands = watches ? 
    Array.from(new Set(watches.map(watch => watch.brand))) : [];
  
  // Apply all filters
  const filteredWatches = watches ? watches.filter(watch => {
    // Category filter
    if (category !== 'all' && watch.category !== category) return false;
    
    // Price range filter
    if (watch.price < priceRange[0] || watch.price > priceRange[1]) return false;
    
    // Brand filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(watch.brand)) return false;
    
    // AR models only filter
    if (arModelsOnly && !watch.modelUrl) return false;
    
    // In stock only filter
    if (inStockOnly && !watch.inStock) return false;
    
    return true;
  }) : [];
  
  // Sort watches based on selected option
  const sortedWatches = filteredWatches ? [...filteredWatches].sort((a, b) => {
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
  
  // Update URL with filter params
  const updateUrlWithFilters = () => {
    const newParams = new URLSearchParams();
    
    if (category !== 'all') newParams.set('category', category);
    if (selectedBrands.length > 0) newParams.set('brands', selectedBrands.join(','));
    if (priceRange[0] > 0) newParams.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 5000) newParams.set('maxPrice', priceRange[1].toString());
    if (arModelsOnly) newParams.set('arOnly', 'true');
    if (inStockOnly) newParams.set('inStock', 'true');
    
    const newLocation = newParams.toString() 
      ? `/shop?${newParams.toString()}` 
      : '/shop';
    
    setLocation(newLocation);
  };
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    updateUrlWithFilters();
  };
  
  // Reset all filters
  const resetFilters = () => {
    setCategory('all');
    setPriceRange([0, 5000]);
    setSelectedBrands([]);
    setArModelsOnly(false);
    setInStockOnly(false);
    setSortBy('default');
    setLocation('/shop');
    
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared",
    });
  };
  
  // Apply filters with toast feedback
  const applyFilters = () => {
    updateUrlWithFilters();
    setShowFilters(false);
    
    toast({
      title: "Filters Applied",
      description: `${sortedWatches.length} watches match your criteria`,
    });
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
                Browse our collection of premium watches with AR try-on
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Mobile: Filter button */}
              <div className="block md:hidden w-full">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => setShowFilters(true)}
                    >
                      <div className="flex items-center">
                        <Sliders className="mr-2 h-4 w-4" />
                        Filters
                      </div>
                      <Badge className="ml-2">
                        {selectedBrands.length + (category !== 'all' ? 1 : 0) + 
                         (arModelsOnly ? 1 : 0) + (inStockOnly ? 1 : 0) + 
                         ((priceRange[0] > 0 || priceRange[1] < 5000) ? 1 : 0)}
                      </Badge>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 sm:w-96">
                    <SheetHeader>
                      <SheetTitle className="flex items-center">
                        <Sliders className="mr-2 h-5 w-5" />
                        Filter Watches
                      </SheetTitle>
                      <SheetDescription>
                        Refine your search with multiple filters
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="py-4 flex flex-col gap-5">
                      {/* Category filter */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Category</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {['all', 'luxury', 'sport', 'casual'].map((cat) => (
                            <div 
                              key={cat}
                              className={cn(
                                "px-3 py-2 border rounded-md text-center cursor-pointer transition-colors",
                                category === cat 
                                  ? "border-primary bg-primary/10 text-primary" 
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                              onClick={() => setCategory(cat)}
                            >
                              {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Price range filter */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium">Price Range</h3>
                          <span className="text-sm text-gray-500">
                            ${priceRange[0]} - ${priceRange[1]}
                          </span>
                        </div>
                        <Slider
                          min={0}
                          max={5000}
                          step={100}
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          className="my-4"
                        />
                        <div className="flex justify-between">
                          <Input
                            type="number"
                            min={0}
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                            className="w-20"
                          />
                          <Input
                            type="number"
                            min={priceRange[0]}
                            max={5000}
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-20"
                          />
                        </div>
                      </div>
                      
                      {/* Brand filter */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Brands</h3>
                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                          {availableBrands.map((brand) => (
                            <div key={brand} className="flex items-center space-x-2">
                              <Checkbox
                                id={`brand-${brand}`}
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedBrands([...selectedBrands, brand]);
                                  } else {
                                    setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                  }
                                }}
                              />
                              <label
                                htmlFor={`brand-${brand}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {brand}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Additional filters */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium mb-3">Additional Filters</h3>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="ar-models-only-mobile"
                            checked={arModelsOnly}
                            onCheckedChange={(checked) => setArModelsOnly(checked as boolean)}
                          />
                          <label
                            htmlFor="ar-models-only-mobile"
                            className="text-sm font-medium leading-none"
                          >
                            AR Compatible Only
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="in-stock-only-mobile"
                            checked={inStockOnly}
                            onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                          />
                          <label
                            htmlFor="in-stock-only-mobile"
                            className="text-sm font-medium leading-none"
                          >
                            In Stock Only
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-6">
                      <Button onClick={applyFilters}>
                        Apply Filters
                      </Button>
                      <Button variant="outline" onClick={resetFilters}>
                        Reset Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              {/* Sort by dropdown (mobile and desktop) */}
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
          
          {/* Main content with filters and products */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop: Sidebar filters */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="h-8 text-xs"
                  >
                    Reset
                  </Button>
                </div>
                
                <Accordion type="multiple" defaultValue={["category", "price", "brand"]}>
                  {/* Category filter */}
                  <AccordionItem value="category" className="border-b">
                    <AccordionTrigger className="py-3 text-sm hover:no-underline">
                      Category
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {['all', 'luxury', 'sport', 'casual'].map((cat) => (
                          <div 
                            key={cat}
                            className={cn(
                              "px-3 py-2 border rounded-md text-sm cursor-pointer transition-colors",
                              category === cat 
                                ? "border-primary bg-primary/10 text-primary" 
                                : "border-gray-200 hover:border-gray-300"
                            )}
                            onClick={() => setCategory(cat)}
                          >
                            {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Price range filter */}
                  <AccordionItem value="price" className="border-b">
                    <AccordionTrigger className="py-3 text-sm hover:no-underline">
                      Price Range
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">${priceRange[0]}</span>
                          <span className="text-sm">${priceRange[1]}</span>
                        </div>
                        <Slider
                          min={0}
                          max={5000}
                          step={100}
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                        />
                        <div className="flex justify-between gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                            className="w-full"
                          />
                          <Input
                            type="number"
                            min={priceRange[0]}
                            max={5000}
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Brand filter */}
                  <AccordionItem value="brand" className="border-b">
                    <AccordionTrigger className="py-3 text-sm hover:no-underline">
                      Brand
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                        {availableBrands.map((brand) => (
                          <div key={brand} className="flex items-center space-x-2">
                            <Checkbox
                              id={`brand-${brand}`}
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedBrands([...selectedBrands, brand]);
                                } else {
                                  setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                }
                              }}
                            />
                            <label
                              htmlFor={`brand-${brand}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {brand}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Additional filters */}
                  <AccordionItem value="additional">
                    <AccordionTrigger className="py-3 text-sm hover:no-underline">
                      Additional Filters
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="ar-models-only"
                            checked={arModelsOnly}
                            onCheckedChange={(checked) => setArModelsOnly(checked as boolean)}
                          />
                          <label
                            htmlFor="ar-models-only"
                            className="text-sm font-medium leading-none"
                          >
                            AR Compatible Only
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="in-stock-only"
                            checked={inStockOnly}
                            onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                          />
                          <label
                            htmlFor="in-stock-only"
                            className="text-sm font-medium leading-none"
                          >
                            In Stock Only
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Button onClick={applyFilters} className="w-full mt-6">
                  Apply Filters
                </Button>
              </div>
            </div>
            
            {/* Products grid */}
            <div className="flex-1">
              {/* Active filters display */}
              {(selectedBrands.length > 0 || category !== 'all' || arModelsOnly || inStockOnly || 
                priceRange[0] > 0 || priceRange[1] < 5000) && (
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {category !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Category: {category.charAt(0).toUpperCase() + category.slice(1)}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setCategory('all')}
                      />
                    </Badge>
                  )}
                  {selectedBrands.map(brand => (
                    <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                      {brand}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))}
                      />
                    </Badge>
                  ))}
                  {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      ${priceRange[0]} - ${priceRange[1]}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setPriceRange([0, 5000])}
                      />
                    </Badge>
                  )}
                  {arModelsOnly && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      AR Compatible
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setArModelsOnly(false)}
                      />
                    </Badge>
                  )}
                  {inStockOnly && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      In Stock
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setInStockOnly(false)}
                      />
                    </Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="h-7 text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              )}
              
              {/* Count and results info */}
              <div className="mb-6 text-sm text-gray-500">
                {!isLoading && (
                  <p>
                    Showing {sortedWatches.length} {sortedWatches.length === 1 ? 'watch' : 'watches'}
                    {category !== 'all' && ` in ${category}`}
                    {selectedBrands.length > 0 && ` from ${selectedBrands.join(', ')}`}
                  </p>
                )}
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Product cards with AR */}
                  {sortedWatches.map((watch) => (
                    <ProductCard key={watch.id} watch={watch} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <div className="inline-flex items-center justify-center p-6 bg-gray-100 rounded-full mb-6">
                    <Watch className="h-10 w-10 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">No watches found</h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    We couldn't find any watches matching your criteria.
                    Try adjusting your filters or browse all watches.
                  </p>
                  <Button onClick={resetFilters}>
                    Reset All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}