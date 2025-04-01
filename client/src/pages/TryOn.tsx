import React, { useEffect, useRef, useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShoppingCart, Camera, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as THREE from "three";
import { useToast } from "@/hooks/use-toast";

// Type for watch
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

export default function TryOn() {
  // Get the watch ID from the URL
  const [, params] = useRoute("/try-on/:id");
  const watchId = params?.id ? parseInt(params.id) : null;
  
  const { toast } = useToast();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Fetch the watch details
  const { data: watch } = useQuery({
    queryKey: ['/api/watches', watchId],
    queryFn: async () => {
      if (!watchId) throw new Error('Invalid watch ID');
      
      const res = await fetch(`/api/watches/${watchId}`);
      if (!res.ok) throw new Error('Failed to fetch watch details');
      return res.json() as Promise<Watch>;
    },
    enabled: !!watchId
  });
  
  // Handle loading state
  React.useEffect(() => {
    if (watch) {
      setIsLoading(false);
    }
  }, [watch]);
  
  // Handle error state
  React.useEffect(() => {
    if (!watch && !isLoading && watchId) {
      setError('Failed to load watch data');
    }
  }, [watch, isLoading, watchId]);
  
  // Add to cart handler
  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${watch?.name} has been added to your cart.`,
    });
  };
  
  // AR camera initialization
  const initializeAR = async () => {
    try {
      // Request camera permission
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
      
      // In a real implementation, we would initialize AR.js or Three.js here
      // to create the AR experience with the watch model
      
      // Simulating model loading
      setTimeout(() => {
        setIsModelLoaded(true);
        
        // We'd normally load the 3D model here
        // Example: using Three.js to load a GLB/GLTF model
        // if (watch?.modelUrl && canvasRef.current) {
        //   const scene = new THREE.Scene();
        //   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        //   const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
        //   // ... additional Three.js setup code
        // }
      }, 2000);
      
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError('Camera access denied. Please allow camera access to use AR features.');
    }
  };
  
  // Stop camera when component unmounts
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-white border-t-transparent mb-4 mx-auto"></div>
          <p>Loading AR experience...</p>
        </div>
      </div>
    );
  }
  
  if (error || !watch) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">AR Experience Unavailable</h1>
          <p className="mb-6">{error || "This watch doesn't support AR try-on or the 3D model couldn't be loaded."}</p>
          <Link href={`/product/${watchId}`}>
            <Button variant="outline" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Product
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* AR Camera View */}
      <div className="relative h-screen w-full">
        {/* Camera feed */}
        {!isCameraActive ? (
          <div className="flex flex-col items-center justify-center h-full text-white text-center p-6">
            <h1 className="text-2xl font-bold mb-4">Try on {watch.name}</h1>
            <p className="mb-8 max-w-md">
              Experience how this watch looks on your wrist with our AR technology.
              Press the button below to start your camera.
            </p>
            <Button onClick={initializeAR} size="lg">
              <Camera className="mr-2 h-5 w-5" />
              Start AR Experience
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
            
            {!isModelLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <div className="text-white text-center">
                  <div className="animate-spin h-10 w-10 rounded-full border-4 border-white border-t-transparent mb-4 mx-auto"></div>
                  <p>Positioning the watch...</p>
                </div>
              </div>
            )}
            
            {/* This would be replaced with actual AR content */}
            {isModelLoaded && (
              <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <img 
                  src={watch.imageUrl}
                  alt={watch.name}
                  className="h-24 w-24 object-contain"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
                />
              </div>
            )}
          </>
        )}
      </div>
      
      {/* AR Controls */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        <Link href={`/product/${watchId}`}>
          <Button variant="outline" size="icon" className="bg-black/50 text-white border-none hover:bg-black/70">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        
        <div className="text-center">
          <h2 className="text-white font-medium text-lg drop-shadow-md">{watch.name}</h2>
          <p className="text-white/80 text-sm drop-shadow-md">{watch.brand}</p>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          variant="outline" 
          size="icon" 
          className="bg-black/50 text-white border-none hover:bg-black/70"
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </div>
      
      {/* AR Bottom Controls */}
      {isCameraActive && (
        <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 mb-6 flex gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ZoomOut className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ZoomIn className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="w-full max-w-md flex gap-4">
            <Button 
              onClick={stopCamera}
              variant="outline" 
              className="flex-1 bg-white/10 backdrop-blur-sm text-white border-white/20"
            >
              Stop AR
            </Button>
            
            <Button 
              onClick={handleAddToCart}
              className="flex-1"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}