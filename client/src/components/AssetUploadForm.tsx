import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";

interface UploadFormProps {
  productId?: number;
  onSuccess?: (data: any) => void;
}

export function AssetUploadForm({ productId, onSuccess }: UploadFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      file: null as File | null,
      category: "product-image",
      productId: productId || "",
    },
  });
  
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const response = await fetch('/api/assets/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || 'Upload failed');
        }
        
        return response.json();
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Tải lên thành công!",
        description: "Tệp đã được tải lên thành công.",
      });
      
      // Làm mới danh sách assets
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      if (productId) {
        queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/assets`] });
      }
      
      // Reset form
      form.reset();
      setPreviewUrl(null);
      
      // Gọi callback nếu có
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi!",
        description: error.message || "Không thể tải tệp lên. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });
  
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("file", file);
      
      // Hiển thị preview nếu là hình ảnh
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  }
  
  function onSubmit(values: any) {
    if (!values.file) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng chọn một tệp để tải lên.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', values.file);
    formData.append('category', values.category);
    if (values.productId) {
      formData.append('productId', values.productId.toString());
    }
    
    uploadMutation.mutate(formData);
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tệp</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg,image/webp,.glb,.gltf"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {previewUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Preview:</p>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full h-auto max-h-48 rounded border border-gray-200" 
            />
          </div>
        )}
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="product-image">Hình ảnh sản phẩm</SelectItem>
                  <SelectItem value="model-3d">Model 3D</SelectItem>
                  <SelectItem value="thumbnail">Thumbnail</SelectItem>
                  <SelectItem value="banner">Banner</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!productId && (
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Sản phẩm (nếu có)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Nhập ID sản phẩm liên quan"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Đang tải lên..." : "Tải lên"}
        </Button>
      </form>
    </Form>
  );
}