import React, { useEffect, useRef, useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShoppingCart, Camera, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Hands } from "@mediapipe/hands";
import * as cam from "@mediapipe/camera_utils";

// Type for watch
type Watch = {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  imageUrl?: string;
  modelUrl: string;
  category: string;
  inStock: boolean;
  createdAt: string;
};

function ARPreview({ watch }: { watch: Watch }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [wristPosition, setWristPosition] = useState<{ x: number; y: number } | null>(null);

  // Start AR preview with hand tracking
  const startARPreview = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(cameraStream);
      setIsActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;

        // Initialize MediaPipe Hands
        const hands = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        hands.onResults((results) => {
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            const wrist = landmarks[0]; // Wrist landmark
            setWristPosition({ x: wrist.x, y: wrist.y });
          }
        });

        // Attach camera to MediaPipe Hands
        const camera = new cam.Camera(videoRef.current, {
          onFrame: async () => {
            await hands.send({ image: videoRef.current! });
          },
          width: 1280,
          height: 720,
        });
        camera.start();
      }
    } catch (err) {
      console.error("Error starting AR preview:", err);
    }
  };

  // Stop AR preview
  const stopARPreview = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsActive(false);
    setWristPosition(null);
  };

  return (
    <div className="relative h-full w-full">
      {!isActive ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Button onClick={startARPreview}>Start AR Preview</Button>
        </div>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline muted className="absolute top-0 left-0 w-full h-full object-cover" />
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
          {wristPosition && (
            <div
              className="absolute"
              style={{
                left: `${wristPosition.x * 100}%`,
                top: `${wristPosition.y * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <img
                src={watch.imageUrl}
                alt={watch.name}
                className="h-24 w-24 object-contain"
                style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))" }}
              />
            </div>
          )}
          <Button onClick={stopARPreview} className="absolute bottom-4 left-4">
            Stop AR
          </Button>
        </>
      )}
    </div>
  );
}

export default function TryOn() {
  // Get the watch ID from the URL
  const [, params] = useRoute("/try-on/:id");
  const watchId = params?.id ? parseInt(params.id) : null;
  
  const { toast } = useToast();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [arScenePresent, setArScenePresent] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wristPosition, setWristPosition] = useState<{ x: number; y: number } | null>(null);

  
  useEffect(() => {
    const checkScriptsLoaded = () => {
      if ((window as any).AFRAME && (window as any).AFRAME.components?.['arjs-camera']) {
        console.log("AR.js components loaded and ready!");
        setScriptsLoaded(true);
      } else {
        console.error("AR.js components not found.");
      }
    };
  
    // Kiểm tra trạng thái của A-Frame và AR.js
    setTimeout(checkScriptsLoaded, 2000); // Tăng thời gian chờ lên 2000ms
  }, []);
  
   
  // Fetch the watch details
  const { data: watch } = useQuery({
    queryKey: ['/api/watches', watchId],
    queryFn: async () => {
        if (!watchId) throw new Error('Invalid watch ID');
        const res = await fetch(`/api/watches/${watchId}`);
        if (!res.ok) throw new Error('Failed to fetch watch details');
        const apiResponse = await res.json();
        console.log("Watch data from API:", apiResponse);
        const watch = {
          ...apiResponse,
          modelUrl: apiResponse.model_url, // Map snake_case to camelCase
        };
        return watch as Watch;
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

  // Check camera permissions
  const checkCameraPermissions = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      console.error('Camera permission denied:', err);
      toast({
        title: "Camera Error",
        description: "Camera access denied. Please allow camera access to use AR features.",
        variant: "destructive",
      });
      return false;
    }
  };

  // AR camera initialization
  const initializeAR = async () => {
    try {
      if (arScenePresent) {
        console.warn('AR scene already present.');
        return;
      }

      console.log("Checking permissions...");
      const hasPermission = await checkCameraPermissions();
      if (!hasPermission) {
        setError('Camera access denied. Please allow camera access to use AR features.');
        toast({ title: "Camera Error", description: "Camera access denied.", variant: "destructive" });
        return;
      }
      
      // Check if scripts are loaded
      if (!scriptsLoaded) {
        toast({ title: "Loading", description: "Please wait while AR components are loading...", duration: 3000 });
        return;
      }

      console.log("Permission granted.");
      console.log("Checking AR.js components availability...");
      console.log("AFRAME.systems.arjs:", (window as any).AFRAME?.systems?.arjs);
      console.log("AFRAME.components['arjs-anchor']:", (window as any).AFRAME?.components?.['arjs-anchor']);
      console.log("AFRAME.components['arjs-camera']:", (window as any).AFRAME?.components?.['arjs-camera']);
      console.log('AFRAME:', (window as any).AFRAME);
      console.log('AR.js components:', (window as any).AFRAME?.components);

      setIsCameraActive(true);
      setArScenePresent(true);
      console.log('AR activated. A-Scene should render via JSX.');

    } catch (err) {
      console.error('Error initializing AR:', err);
      setError('Failed to initialize AR. Please check console.');
      toast({ title: "AR Error", description: "Failed to initialize AR.", variant: "destructive" });
    }
  };

  // Stop camera
  const stopCamera = () => {
    console.log("Stopping AR...");
    setIsCameraActive(false);
    setIsModelLoaded(false);
    setArScenePresent(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      console.log('Component unmounted, AR stopped.');
    };
  }, []);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
  
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  
    hands.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const wrist = results.multiHandLandmarks[0][0]; // Vị trí cổ tay
        setWristPosition({ x: wrist.x, y: wrist.y });
      }
    });
  
    if (videoRef.current) {
      const camera = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) { // Ensure videoRef.current is not null
            await hands.send({ image: videoRef.current! });
          }
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  // Loading screen
  if (isLoading || !scriptsLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent mb-4 mx-auto"></div>
          <h1 className="text-xl font-bold">Loading AR Experience...</h1>
          <p className="text-gray-400 mt-2">
          Bạn đợi chút nhé chúng tôi tải các thành phần AR và xem chi tiết.
          </p>
        </div>
      </div>
    );
  }

  if (!scriptsLoaded) {
    return <div>Loading AR components...</div>;
  }

  // Error screen
  if (error || !watch) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">AR Experience Unavailable</h1>
          <p className="mb-6 text-gray-400">
            {error || "This watch doesn't support AR try-on or the 3D model couldn't be loaded."}
          </p>
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
  
  console.log("Watch data:", watch);
  console.log("Model URL:", watch?.modelUrl);
  console.log("Full Model URL:", watch?.modelUrl ? `http://localhost:5000${watch.modelUrl}` : "Fallback URL");

  if (!watch?.modelUrl) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>3D model is not available for this watch.</p>
      </div>
    );
  }

  watch.modelUrl = watch.modelUrl || "/uploads/models/default_model.gltf";

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* AR Camera View */}
      <div className="relative h-screen w-full">
        {/* Camera feed / A-Frame Scene */} 
        {!isCameraActive ? (
          <div className="flex flex-col items-center justify-center h-full text-white text-center p-6">
            <h1 className="text-3xl font-bold mb-4">Try on {watch.name}</h1>
            <p className="mb-8 max-w-md text-gray-300">
              Experience how this watch looks on your wrist with our AR technology.
              Press the button below to start your camera.
            </p>
            <Button onClick={initializeAR} size="lg" disabled={!scriptsLoaded} className="bg-blue-600 hover:bg-blue-700">
              <Camera className="mr-2 h-5 w-5" />
              {scriptsLoaded ? "Start AR Experience" : "Loading AR Components..."}
            </Button>
          </div>
        ) : (
          // Render A-Frame scene with correct AR.js configuration
          <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;">
            <a-entity
              gltf-model="#watch-model"
              position={`${wristPosition?.x || 0} ${wristPosition?.y || 0} 0`}
              scale="0.1 0.1 0.1"
              rotation="0 0 0"
            ></a-entity>
            <a-entity camera></a-entity>
          </a-scene>
        )}
      </div>
      
      {/* AR Controls */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        <Link href={`/product/${watchId}`}>
          <div className="bg-black/50 text-white border-none hover:bg-black/70">
            <ArrowLeft className="h-5 w-5" />
          </div>
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