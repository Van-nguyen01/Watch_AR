import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { ARButton } from "@/components/ARButton";
import { useAuthGuard } from "@/hooks/useAuthGuard";


type Watch = {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string;
  modelUrl: null | string;
  category: string;
  inStock: boolean;
  createdAt: string;
};


function ARPreview({ watch }: { watch: Watch }) {
  useAuthGuard();
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const startARPreview = async () => {
    console.log("startARPreview function called");
    try {
      console.log("Requesting camera access...");
      const cameraStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      console.log("Camera access granted, stream received:", cameraStream);
      setStream(cameraStream);
      setIsActive(true);
      
      toast({
        title: "AR Preview Started",
        description: "Position your wrist in front of the camera",
      });
      console.log("Success toast displayed");
      
    } catch (err) {
      console.error("Error in startARPreview catch block:", err);
   
      let errorMessage = "An unknown error occurred. Please check console.";
      if (err instanceof Error) {
        errorMessage = `Please check permissions or console. Error: ${err.message}`;
      }

      toast({
        title: "Camera access denied or Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isActive && stream && videoRef.current) {
      console.log("useEffect: Assigning stream to video element");
      videoRef.current.srcObject = stream;
    }
  }, [isActive, stream]);

  const stopARPreview = () => {
    console.log("stopARPreview called");
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      console.log("Camera tracks stopped");
    }
    setStream(null);
    setIsActive(false);
  };
  
  useEffect(() => {
    return () => {
      console.log("ARPreview cleanup effect");
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
                onError={(e) => { e.currentTarget.src = '/uploads/images/default.jpg'; }}
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
                  onError={(e) => { e.currentTarget.src = '/uploads/images/default.jpg'; }}
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
                  
                  <Link to={`/try-on/${watch.id}`}>
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
            <div className="text-lg font-bold">
              {watch.price.toLocaleString('vi-VN')} ₫
            </div>
            <div className="text-sm text-gray-500">{watch.brand}</div>
          </div>
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
            <Link to={`/product/${watch.id}`}>
              <Button>View Details</Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ProductCard({ watch }: { watch: Watch }) {
  const { toast } = useToast();

  const handleAddToCart = async () => {
    try {
      const userId = localStorage.getItem("userId") || 1;
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          watchId: watch.id,
          quantity: 1,
        }),
      });
      if (res.ok) {
        toast({
          title: "Added to cart",
          description: `${watch.name} has been added to your cart.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add to cart.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="h-56 flex items-center justify-center bg-gray-50 relative">
        <img
          src={watch.imageUrl}
          alt={watch.name}
          onError={(e) => {
            e.currentTarget.src = "/uploads/images/default.jpg";
          }}
          className="max-h-44 w-auto object-contain"
        />
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="capitalize bg-white/80 backdrop-blur-sm">
            {watch.category}
          </Badge>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <h3 className="text-base font-semibold mb-1 line-clamp-2">{watch.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-1">{watch.brand}</p>
        </div>
        <div className="flex-1 flex flex-col justify-end">
          <div className="mb-3 flex justify-center">
            <Link to={`/try-on/${watch.id}`}>
              <Button size="sm" variant="default">
                Try On
              </Button>
            </Link>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base font-bold whitespace-nowrap">
              {watch.price.toLocaleString("vi-VN")} ₫
            </span>
            <div className="flex gap-2">
              <Link to={`/product/${watch.id}`}>
                <Button size="sm" variant="outline">View</Button>
              </Link>
              <Button size="sm" variant="outline" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function Shop() {
  console.log("Shop component mounted");
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const initialCategory = urlParams.get('category') || 'all';
  const { toast } = useToast();

  const [category, setCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [arModelsOnly, setArModelsOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setCategory(urlParams.get('category') || 'all');
    setSelectedBrands(urlParams.get('brands') ? urlParams.get('brands')!.split(',') : []);
    setPriceRange([
      urlParams.get('minPrice') ? parseInt(urlParams.get('minPrice')!) : 0,
      urlParams.get('maxPrice') ? parseInt(urlParams.get('maxPrice')!) : 1000000000,
    ]);
    setArModelsOnly(urlParams.get('arOnly') === 'true');
    setInStockOnly(urlParams.get('inStock') === 'true');
  }, [location.search]);
  

  const { data: watches, isLoading } = useQuery({
    queryKey: ['/api/watches'],
    queryFn: async () => {
      const res = await fetch('/api/watches');
      if (!res.ok) throw new Error('Failed to fetch watches');
      const data = await res.json() as Watch[];

      return data.map((watch: any) => ({
      ...watch,
      imageUrl: (watch.image_url || "").startsWith('http')
        ? watch.image_url
        : `http://localhost:5000${watch.image_url || ""}`,
      modelUrl: watch.model_url,
      inStock: Boolean(watch.in_stock),
  
    }));
      
    }
  });
  
  if (isLoading) {setArModelsOnly
    console.log("Loading watches...");
  } else if (watches) {
    console.log("Watches from API:", watches);
  } else {
    console.log("No watches found or an error occurred.");
  }
  
  console.log("category", category);
  console.log("selectedBrands", selectedBrands);
  console.log("arModelsOnly", arModelsOnly);
  console.log("inStockOnly", inStockOnly);
  console.log("priceRange", priceRange);

  const availableBrands = watches ? 
    Array.from(new Set(watches.map(watch => watch.brand))) : [];

  const filteredWatches = (watches ?? []).filter(watch => {
    if (category !== 'all' && watch.category !== category) {
      return false;
    }
    if (watch.price < priceRange[0] || watch.price > priceRange[1]) {
      return false;
    }
    if (selectedBrands.length > 0 && !selectedBrands.includes(watch.brand)) {
      return false;
    }
    if (arModelsOnly && !watch.modelUrl) {
      return false;
    }
    if (inStockOnly && !watch.inStock) {
      return false;
    }
    return true;
  });
  

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
  
  console.log("Filtered watches:", filteredWatches);
  console.log("Sorted watches:", sortedWatches);
  

  const updateUrlWithFilters = () => {
    const newParams = new URLSearchParams();
    
    if (category !== 'all') newParams.set('category', category);
    if (selectedBrands.length > 0) newParams.set('brands', selectedBrands.join(','));
    if (priceRange[0] > 0) newParams.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 100000000) newParams.set('maxPrice', priceRange[1].toString());
    if (arModelsOnly) newParams.set('arOnly', 'true');
    if (inStockOnly) newParams.set('inStock', 'true');
    
    const newLocation = newParams.toString() 
      ? `/shop?${newParams.toString()}` 
      : '/shop';
    
    navigate(newLocation);
  };
  
 
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    updateUrlWithFilters();
  };
  

  const resetFilters = () => {
    setCategory('all');
    setPriceRange([0, 100000000]);
    setSelectedBrands([]);
    setArModelsOnly(false);
    setInStockOnly(false);
    setSortBy('default');
    navigate("/shop");
    
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared",
    });
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
           
            <div className="hidden md:block w-72 flex-shrink-0">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24 min-h-[500px]">
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
                  
                  <AccordionItem value="price" className="border-b">
                    <AccordionTrigger className="py-3 text-sm hover:no-underline">
                      Price Range
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            {priceRange[0].toLocaleString('vi-VN')} ₫
                          </span>
                          <span className="text-sm">
                            {priceRange[1].toLocaleString('vi-VN')} ₫
                          </span>
                        </div>
                        <Slider
                          min={0}
                          max={100000000}
                          step={100000}
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
                            max={100000000}
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
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
            
            <div className="flex-1">
              {(selectedBrands.length > 0 || category !== 'all' || arModelsOnly || inStockOnly || 
                priceRange[0] > 0 || priceRange[1] < 100000000) && (
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
                  {(priceRange[0] > 0 || priceRange[1] < 100000000) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {priceRange[0].toLocaleString('vi-VN')} ₫ - {priceRange[1].toLocaleString('vi-VN')} ₫
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setPriceRange([0, 100000000])}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
           
                  {Array(8).fill(0).map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md flex flex-col h-full p-6 overflow-visible">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
       
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
