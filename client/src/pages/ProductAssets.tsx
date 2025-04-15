import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AssetUploadForm } from "@/components/AssetUploadForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { Asset } from "@shared/schema";

export default function ProductAssets() {
  const [, params] = useRoute("/product/:id/assets");
  const productId = params ? parseInt(params.id) : undefined;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("images");

  // Fetch product details
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['/api/watches', productId],
    queryFn: async () => {
      if (!productId) return null;
      const response = await apiRequest(`/api/watches/${productId}`);
      return response;
    },
    enabled: !!productId
  });

  // Fetch product assets
  const { data: assets = [], isLoading: isLoadingAssets } = useQuery({
    queryKey: [`/api/products/${productId}/assets`],
    queryFn: async () => {
      if (!productId) return [];
      const response = await apiRequest(`/api/products/${productId}/assets`);
      return response as Asset[];
    },
    enabled: !!productId
  });

  // Delete asset mutation
  const deleteAssetMutation = useMutation({
    mutationFn: async (assetId: number) => {
      const options = { method: 'DELETE' };
      return apiRequest(`/api/assets/${assetId}`, options as any);
    },
    onSuccess: () => {
      toast({
        title: "Xóa thành công",
        description: "Asset đã được xóa khỏi sản phẩm."
      });
      
      // Refresh the assets list
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/assets`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa asset. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  });

  // Group assets by category
  const imageAssets = assets?.filter(asset => 
    asset.category === "product-image" || 
    asset.category === "thumbnail" || 
    asset.category === "banner"
  ) || [];
  
  const modelAssets = assets?.filter(asset => 
    asset.category === "model-3d"
  ) || [];

  // Handle delete
  const handleDeleteAsset = (assetId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa asset này không?")) {
      deleteAssetMutation.mutate(assetId);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (!productId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Lỗi: Không tìm thấy sản phẩm</h1>
          <p>Vui lòng quay lại và chọn một sản phẩm.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isLoadingProduct ? "Đang tải..." : `Assets cho: ${product?.name}`}
          </h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            Quay lại
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phần tải lên asset mới */}
          <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Thêm asset mới</h2>
            <AssetUploadForm 
              productId={productId} 
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/assets`] });
              }} 
            />
          </div>

          {/* Danh sách assets */}
          <div className="md:col-span-2 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Assets</h2>
            
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-4">
                <TabsTrigger value="images">
                  Hình ảnh ({imageAssets.length})
                </TabsTrigger>
                <TabsTrigger value="models">
                  Models 3D ({modelAssets.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="images" className="space-y-4">
                {isLoadingAssets ? (
                  <p>Đang tải hình ảnh...</p>
                ) : imageAssets.length === 0 ? (
                  <p>Chưa có hình ảnh nào cho sản phẩm này.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {imageAssets.map((asset: Asset) => (
                      <div key={asset.id} className="border rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <img 
                            src={asset.publicUrl} 
                            alt={asset.originalName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-sm truncate" title={asset.originalName}>
                            {asset.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {asset.category}
                          </p>
                          <div className="flex justify-end mt-2">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteAsset(asset.id)}
                            >
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="models" className="space-y-4">
                {isLoadingAssets ? (
                  <p>Đang tải models 3D...</p>
                ) : modelAssets.length === 0 ? (
                  <p>Chưa có model 3D nào cho sản phẩm này.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {modelAssets.map((asset: Asset) => (
                      <div key={asset.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{asset.originalName}</h3>
                            <p className="text-sm text-gray-500">
                              {(asset.fileSize / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            <p className="text-sm">
                              <a 
                                href={asset.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Xem file
                              </a>
                            </p>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteAsset(asset.id)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}