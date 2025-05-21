import React, { useEffect, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { ArrowLeft, ShoppingCart, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthGuard } from "@/hooks/useAuthGuard";


declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-assets': any;
      'a-marker': any;
      'a-entity': any;
      'a-camera': any;
      'a-nft': any;
    }
  }
}

type Watch = {
  id: number;
  name: string;
  brand: string;
  model_url: string;
};

export default function TryOn() {
  useAuthGuard();
  
  const [, params] = useRoute("/try-on/:id");
  const watchId = params?.id ? params.id : null;
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [watch, setWatch] = useState<Watch | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);

  useEffect(() => {
    if (!watchId) return;
    fetch(`/api/watches/${watchId}`)
      .then(res => res.json())
      .then((data: Watch) => {
        setModelUrl(data.model_url);
        setWatch(data);
      });
  }, [watchId]);

  const handleAddToCart = async () => {
    if (!watch) return;
    const userId = Number(localStorage.getItem("userId")) || 1;
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          description: "Could not add to cart.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add to cart.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    setIsCameraActive(false);
  };

  const handleGoToShop = () => {
    window.location.href = "/shop";
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const handleTryOn = () => {
    navigate("/shop");
  };

  const fullModelUrl = modelUrl?.startsWith("http")
    ? modelUrl
    : `http://localhost:5000${modelUrl}`;

  if (!modelUrl) return <div>Đang tải mô hình AR...</div>;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {isCameraActive && (
        <a-scene
          arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
          embedded
          renderer="logarithmicDepthBuffer: true;"
          vr-mode-ui="enabled: false"
          gesture-detector
          id="scene"
          style={{ width: "100vw", height: "100vh" }}
        >
          <a-marker
            preset="hiro"
            raycaster="objects: .clickable"
            emitevents="true"
            cursor="fuse: false; rayOrigin: mouse;"
          >
            <a-entity
              gltf-model={fullModelUrl}
              scale="0.5 0.5 0.5"
              position="0 0 0"
              class="clickable"
              gesture-handler="minScale: 0.1; maxScale: 2; rotationEnabled: true; translationEnabled: false"
            />
          </a-marker>
          <a-entity camera></a-entity>
        </a-scene>
      )}

      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/50 text-white border-none hover:bg-black/70"
          onClick={handleGoToShop}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h2 className="text-white font-medium text-lg drop-shadow-md">{watch?.name}</h2>
          <p className="text-white/80 text-sm drop-shadow-md">{watch?.brand}</p>
        </div>
        <Button
          onClick={handleGoToCart}
          variant="outline"
          size="icon"
          className="bg-black/50 text-white border-none hover:bg-black/70"
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </div>

      {isCameraActive ? (
        <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-center z-10">
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
      ) : (
        <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-center z-10">
          <Button
            onClick={handleTryOn}
            className="w-full max-w-md bg-primary text-white"
          >
            Try On
          </Button>
        </div>
      )}
    </div>
  );
}