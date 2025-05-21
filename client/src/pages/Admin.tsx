import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AssetUploadForm } from "@/components/AssetUploadForm";
import type { Watch, User } from "@shared/schema";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function Admin() {
  useAuthGuard("admin");
  const [watches, setWatches] = useState<Watch[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingWatch, setEditingWatch] = useState<Watch | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [uploadType, setUploadType] = useState<"image" | "model" | null>(null);

  useEffect(() => {
    fetch("/api/watches").then(res => res.json()).then(setWatches);
    fetch("/api/users").then(res => res.json()).then(setUsers);
    const token = localStorage.getItem('auth_token');

  if (token) {
    fetch("/api/watches", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    })
      .then(res => res.json())
      .then(setWatches);

    fetch("/api/users", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    })
      .then(res => res.json())
      .then(setUsers);
  } else {
    
    console.log('No token found');
  }
  }, []);


  const deleteWatch = (id: number) => {
    if (window.confirm("Xóa sản phẩm này?")) {
      fetch(`/api/watches/${id}`, { method: "DELETE" })
        .then(() => setWatches(watches.filter((w: any) => w.id !== id)));
    }
  };

  const deleteUser = (id: number) => {
    if (window.confirm("Xóa người dùng này?")) {
      fetch(`/api/users/${id}`, { method: "DELETE" })
        .then(() => setUsers(users.filter((u: any) => u.id !== id)));
    }
  };


  const handleSaveWatch = async (e: any) => {
    e.preventDefault();
    const form = e.target;

    let imageUrl = form.imageUrl.value;
    const imageFile = form.imageFile.files[0];
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("category", "product-image");
      const res = await fetch("/api/assets/upload", {
        method: "POST",
        body: formData,
      });
      const uploaded = await res.json();
      imageUrl = uploaded.fileUrl || uploaded.publicUrl || imageUrl;
    }


    let modelUrl = form.modelUrl.value;
    const modelFile = form.modelFile.files[0];
    if (modelFile) {
      const formData = new FormData();
      formData.append("file", modelFile);
      formData.append("category", "model-3d");
      const res = await fetch("/api/assets/upload", {
        method: "POST",
        body: formData,
      });
      const uploaded = await res.json();
      modelUrl = uploaded.fileUrl || uploaded.publicUrl || modelUrl;
    }

  
    const data = {
      name: form.name.value,
      brand: form.brand.value,
      description: form.description.value,
      price: parseFloat(form.price.value),
      imageUrl,
      modelUrl,
      category: form.category.value,
      inStock: form.inStock.checked,
    };


    if (editingWatch) {
      fetch(`/api/watches/${editingWatch.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then((updated) => {
          setWatches(watches.map((w) => w.id === updated.id ? updated : w));
          setEditingWatch(null);
        });
    } else {
      fetch("/api/watches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then((created) => {
          setWatches([...watches, created]);
          form.reset();
        });
    }
  };


  const renderWatchForm = () => (
    <form onSubmit={handleSaveWatch} className="mb-6 space-y-2">
      <Input name="name" placeholder="Tên sản phẩm" defaultValue={editingWatch?.name || ""} required />
      <Input name="brand" placeholder="Hãng" defaultValue={editingWatch?.brand || ""} required />
      <Input name="description" placeholder="Mô tả" defaultValue={editingWatch?.description || ""} required />
      <Input name="price" type="number" placeholder="Giá" defaultValue={editingWatch?.price || ""} required />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Input name="imageUrl" placeholder="Đường dẫn ảnh" defaultValue={editingWatch?.imageUrl || ""} required />
        <Input name="imageFile" type="file" accept="image/*" style={{ width: 180 }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Input name="modelUrl" placeholder="Đường dẫn model 3D (.glb/.gltf)" defaultValue={editingWatch?.modelUrl || ""} />
        <Input name="modelFile" type="file" accept=".glb,.gltf" style={{ width: 180 }} />
      </div>
      <Input name="category" placeholder="Danh mục (luxury, sport, casual...)" defaultValue={editingWatch?.category || ""} required />
      <label>
        <input type="checkbox" name="inStock" defaultChecked={editingWatch?.inStock ?? true} />
        Còn hàng
      </label>
      <Button type="submit">{editingWatch ? "Lưu thay đổi" : "Thêm sản phẩm"}</Button>
      {editingWatch && <Button type="button" onClick={() => setEditingWatch(null)}>Hủy</Button>}
    </form>
  );

  
  const handleShowUpload = (productId: number, type: "image" | "model") => {
    setSelectedProductId(productId);
    setUploadType(type);
    setShowUpload(true);
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Quản trị sản phẩm</h1>
      {renderWatchForm()}
      <table className="w-full border mb-10">
        <thead>
          <tr>
            <th>Tên</th><th>Hãng</th><th>Giá</th><th>Model</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {watches.map((w) => (
            <tr key={w.id}>
              <td>{w.name}</td>
              <td>{w.brand}</td>
              <td>{w.price}</td>
              <td>
                <Button onClick={() => handleShowUpload(w.id, "image")}>Tải ảnh</Button>
                <Button onClick={() => handleShowUpload(w.id, "model")}>Tải model 3D</Button>
                {showUpload && selectedProductId === w.id && (
                  <div className="mt-2">
                    <AssetUploadForm
                      productId={w.id}
                      category={uploadType === "image" ? "product-image" : "model-3d"}
                      onSuccess={() => setShowUpload(false)}
                    />
                    <Button onClick={() => setShowUpload(false)}>Đóng</Button>
                  </div>
                )}
              </td>
              <td>
                <Button onClick={() => setEditingWatch(w)}>Sửa</Button>
                <Button onClick={() => deleteWatch(w.id)}>Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mt-10 mb-4">Quản lý người dùng</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Tên</th><th>Email</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <Button onClick={() => deleteUser(u.id)}>Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
