import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Watch } from "@shared/schema";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideInfo, Camera, Smartphone } from "lucide-react";

export default function TryOn() {
  const [, params] = useRoute<{ id: string }>("/try-on/:id");
  const watchId = params?.id ? parseInt(params.id) : undefined;
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [arActive, setArActive] = useState(false);
  const [activeTab, setActiveTab] = useState("instructions");
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Check if WebXR/AR is supported
  useEffect(() => {
    // For this example, we'll just simulate support check
    // In a real app, we would check navigator.xr or similar
    const checkARSupport = async () => {
      try {
        // Simulate checking AR support
        // In a real app: const supported = 'xr' in navigator && await navigator.xr.isSessionSupported('immersive-ar');
        const supported = true; // For demo purposes
        setArSupported(supported);
      } catch (error) {
        console.error("Error checking AR support:", error);
        setArSupported(false);
      }
    };
    
    checkARSupport();
  }, []);

  // Fetch the watch data
  const { data: watch, isLoading, error } = useQuery<Watch>({
    queryKey: ['/api/watches', watchId],
    queryFn: watchId ? getQueryFn({ on401: 'throw' }) : () => Promise.resolve(null),
    enabled: !!watchId,
  });

  // Function to start AR experience
  const startAR = async () => {
    if (!watch) return;
    
    // In a real app, we would initialize WebXR here
    // For this demo, we'll simulate by showing a video feed
    try {
      if (videoRef.current) {
        const constraints = {
          video: { facingMode: "environment" }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setArActive(true);
        setActiveTab("experience");
      }
    } catch (error) {
      console.error("Error starting AR:", error);
      setArSupported(false);
    }
  };

  // Stop AR experience
  const stopAR = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setArActive(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <p>Loading AR experience...</p>
      </div>
    );
  }

  if (error || !watch) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Error loading watch data</p>
        <Button asChild>
          <Link to="/store">Back to Store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <Button variant="outline" size="sm" className="w-fit" asChild>
            <Link to={`/watch/${watch.id}`}>← Back to Watch Details</Link>
          </Button>
          <h1 className="text-3xl font-bold">Try On: {watch.name}</h1>
          <p className="text-muted-foreground">
            Experience how this {watch.brand} watch looks on your wrist using augmented reality
          </p>
        </div>

        {arSupported === false && (
          <Alert variant="destructive" className="mb-8">
            <LucideInfo className="h-4 w-4" />
            <AlertTitle>AR Not Supported</AlertTitle>
            <AlertDescription>
              Your device or browser doesn't support augmented reality. Please try using a more recent device or browser.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="sticky top-8">
              <div className="aspect-square rounded-lg overflow-hidden mb-4">
                <img src={watch.imageUrl} alt={watch.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-semibold">{watch.name}</h2>
              <p className="text-muted-foreground mb-4">{watch.brand}</p>
              
              <Button 
                onClick={arActive ? stopAR : startAR} 
                disabled={arSupported === false}
                className="w-full"
              >
                {arActive ? "Stop AR Experience" : "Start AR Experience"}
              </Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="experience" disabled={!arActive}>AR Experience</TabsTrigger>
              </TabsList>
              
              <TabsContent value="instructions" className="space-y-6 py-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Prepare Your Device
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Make sure you're in a well-lit area</li>
                    <li>Allow camera permissions when prompted</li>
                    <li>Hold your device steady</li>
                    <li>Have your wrist visible in the frame</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Using the AR Experience
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>After starting, point your camera at your wrist</li>
                    <li>The watch will automatically position itself</li>
                    <li>Move your wrist to see different angles</li>
                    <li>Take a screenshot to save the view</li>
                  </ul>
                </div>
                
                <Alert>
                  <LucideInfo className="h-4 w-4" />
                  <AlertTitle>Privacy Information</AlertTitle>
                  <AlertDescription>
                    Your camera feed is processed locally on your device. No images are stored or transmitted to our servers.
                  </AlertDescription>
                </Alert>
              </TabsContent>
              
              <TabsContent value="experience" className="py-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-black relative">
                  <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover"
                    playsInline
                  />
                  
                  {arActive && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                      Position your wrist in the center of the frame
                    </div>
                  )}
                  
                  {/* This would be where the 3D model is overlaid in a real app */}
                  {arActive && (
                    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 opacity-80 pointer-events-none">
                      <img 
                        src={watch.imageUrl} 
                        alt="AR Watch" 
                        className="h-24 w-24 object-contain"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button onClick={stopAR} variant="outline">
                    End AR Experience
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}