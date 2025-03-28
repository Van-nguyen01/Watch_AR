import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Watch } from "@shared/schema";
import { useRoute, Link as WouterLink } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export default function WatchDetail() {
  // Get the watch ID from the URL
  const [, params] = useRoute<{ id: string }>("/watch/:id");
  const watchId = params?.id ? parseInt(params.id) : undefined;

  // Fetch the watch data
  const { data: watch, isLoading, error } = useQuery<Watch>({
    queryKey: ['/api/watches', watchId],
    queryFn: watchId ? getQueryFn({ on401: 'throw' }) : () => Promise.resolve(null),
    enabled: !!watchId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <p>Loading watch details...</p>
      </div>
    );
  }

  if (error || !watch) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Error loading watch details</p>
        <Button asChild>
          <WouterLink to="/store">Back to Store</WouterLink>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 mb-8">
        <Button variant="outline" size="sm" className="w-fit" asChild>
          <WouterLink to="/store">← Back to Store</WouterLink>
        </Button>
        <h1 className="text-4xl font-bold">{watch.name}</h1>
        <div className="flex items-center gap-2">
          <Badge className="text-sm">{watch.category}</Badge>
          <span className="text-muted-foreground">By {watch.brand}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="rounded-lg overflow-hidden">
            <img 
              src={watch.imageUrl} 
              alt={watch.name} 
              className="w-full h-auto object-cover"
            />
          </div>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Try Before You Buy</h3>
              <p className="mb-4">
                Experience how this watch looks on your wrist using our AR technology.
                No app download required - just use your device's camera!
              </p>
              <Button className="w-full" asChild>
                <WouterLink to={`/try-on/${watch.id}`}>
                  Try on with AR
                </WouterLink>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p className="text-lg">{watch.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">${watch.price}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Dimensions</span>
                <span className="font-medium">{watch.dimensions}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Availability</span>
                <span className="font-medium">{watch.inStock ? "In Stock" : "Out of Stock"}</span>
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="list-disc pl-5 space-y-1">
              {watch.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="pt-6">
            <Button size="lg" className="w-full">Add to Cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
}