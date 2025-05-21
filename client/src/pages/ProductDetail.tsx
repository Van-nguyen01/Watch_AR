import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link, useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Share, 
  Heart, 
  Check, 
  ChevronRight,
  ImagePlus 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";


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

type ARViewProps = {
  modelUrl: string;
  onClose: () => void;
};

export function ARView({ modelUrl, onClose }: ARViewProps) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, zIndex: 1100 }}>Đóng AR</button>
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;" vr-mode-ui="enabled: false">
            //   <a-marker preset="hiro">
            //     <a-entity
            //       gltf-model="url(${modelUrl})"
            //       scale="1 1 1"
            //       position="0 0 0"
            //       rotation="-90 0 0"
            //     ></a-entity>
            //   </a-marker>
            //   <a-entity camera></a-entity>
                <a-marker type="pattern" url="/markers/hiro.patt">
                  <a-entity
                    gltf-model="url(${modelUrl})"
                    scale="0.1 0.1 0.1"
                    position="0 0 0"
                    rotation="0 0 0"
                    onError={(e: any) => console.error('Error loading GLTF model:', e.detail?.src, e)}
                    onLoaded={() => console.log('GLTF model loaded successfully!')}
                  ></a-entity>
                </a-marker>
            </a-scene>
            
          `
        }}
      />
    </div>
  );
}

export default function ProductDetail() {

  const [, params] = useRoute("/product/:id");
  const watchId = params?.id ? parseInt(params.id) : null;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState(1);
  
  
  const { data: watch, isLoading, error } = useQuery({
    queryKey: ['/api/watches', watchId],
    queryFn: async () => {
      if (!watchId) throw new Error('Invalid watch ID');
      const res = await fetch(`/api/watches/${watchId}`);
      if (!res.ok) throw new Error('Failed to fetch watch details');
      const data = await res.json();
    
      return {
        ...data,
        imageUrl: (data.image_url || "").startsWith('http')
          ? data.image_url
          : `http://localhost:5000${data.image_url || ""}`,
        modelUrl: data.model_url,
        inStock: Boolean(data.in_stock),
      };
    },
    enabled: !!watchId,
  });
  
  const handleAddToCart = () => {
    
    toast({
      title: "Added to cart",
      description: `${watch?.name} (Qty: ${quantity}) has been added to your cart.`,
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Header />
        <main className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 w-1/4 mb-8 rounded"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 h-96 bg-gray-200 rounded-lg"></div>
              <div className="md:w-1/2">
                <div className="h-10 bg-gray-200 w-3/4 mb-4 rounded"></div>
                <div className="h-6 bg-gray-200 w-1/3 mb-6 rounded"></div>
                <div className="h-8 bg-gray-200 w-1/4 mb-6 rounded"></div>
                <div className="h-4 bg-gray-200 mb-2 rounded"></div>
                <div className="h-4 bg-gray-200 mb-2 rounded"></div>
                <div className="h-4 bg-gray-200 mb-8 rounded w-3/4"></div>
                <div className="h-12 bg-gray-200 mb-4 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !watch) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the watch you're looking for.</p>
          <Link href="/shop">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container py-8">
        {/* Breadcrumb and admin actions */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/">
              <a className="hover:text-primary transition-colors">Home</a>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/shop">
              <a className="hover:text-primary transition-colors">Shop</a>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href={`/shop?category=${watch.category}`}>
              <a className="hover:text-primary transition-colors capitalize">{watch.category}</a>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-700 truncate max-w-[150px]">{watch.name}</span>
          </div>
          
          {/* Admin Actions */}
          <Link href={`/product/${watch.id}/assets`}>
            <Button variant="outline" size="sm">
              <ImagePlus className="mr-2 h-4 w-4" />
              Quản lý hình ảnh & model
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          {/* Product Images */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src={watch.imageUrl || watch.imageUrl} 
                alt={watch.name} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{watch.name}</h1>
            <p className="text-xl text-gray-600 mb-4">{watch.brand}</p>
            
            <div className="text-2xl font-bold text-primary mb-6">
              {watch.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </div>
            
            <p className="text-gray-600 mb-6">
              {watch.description}
            </p>
            
            {/* Availability */}
            <div className="flex items-center mb-6">
              <div className={`h-3 w-3 rounded-full mr-2 ${watch.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={watch.inStock ? 'text-green-600' : 'text-red-600'}>
                {watch.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            {/* Quantity selector */}
            <div className="flex items-center mb-6">
              <span className="mr-4">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded">
                <button 
                  className="px-3 py-1 border-r border-gray-300"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  className="px-3 py-1 border-l border-gray-300"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleAddToCart}
                disabled={!watch.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              
              <Link href={`/try-on/${watch.id}`}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  disabled={!watch.modelUrl}
                >
                  Try AR
                </Button>
              </Link>
            </div>
            
            {/* Wishlist and Share */}
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">
                <Heart className="mr-2 h-4 w-4" />
                Add to Wishlist
              </Button>
              
              <Button variant="ghost" size="sm">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
        
        {/* Product details tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="mb-6">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-4">Product Description</h3>
            <p className="text-gray-600 mb-4">
              {watch.description}
            </p>
            <p className="text-gray-600">
              Experience luxury at your wrist with this premium timepiece. Crafted with precision and designed for elegance, this watch is a statement of style and functionality.
            </p>
          </TabsContent>
          
          <TabsContent value="specifications" className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-4">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-b pb-2">
                <span className="font-medium">Brand:</span> {watch.brand}
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">Model:</span> {watch.name}
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">Category:</span> {watch.category}
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">Water Resistance:</span> 5 ATM
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">Movement:</span> Automatic
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">Case Material:</span> Stainless Steel
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">Strap Material:</span> Genuine Leather
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">Case Diameter:</span> 42mm
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="shipping" className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-4">Shipping & Returns</h3>
            <div className="mb-4">
              <h4 className="font-medium mb-2">Shipping Information</h4>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Free standard shipping on all orders over $100</li>
                <li>Standard shipping: 3-7 business days</li>
                <li>Express shipping: 1-3 business days (additional cost)</li>
                <li>International shipping available to select countries</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Return Policy</h4>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>30-day return policy for unworn items</li>
                <li>Returns must include original packaging and tags</li>
                <li>Free returns for orders within the United States</li>
                <li>Exchanges available for different sizes or models</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Related watches section would go here */}
      </main>
      <Footer />
    </div>
  );
}