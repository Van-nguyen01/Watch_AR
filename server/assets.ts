import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { db } from './db';
import { assets, type InsertAsset } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Cấu hình lưu trữ của multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Xác định thư mục dựa trên loại file
    let uploadPath = 'public/uploads/';
    if (file.mimetype.startsWith('image/')) {
      uploadPath += 'images/';
    } else if (file.mimetype.includes('model') || file.originalname.endsWith('.glb') || file.originalname.endsWith('.gltf')) {
      uploadPath += 'models/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất với UUID để tránh trùng lặp
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  }
});

// Bộ lọc file để chỉ chấp nhận hình ảnh và model 3D
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Danh sách các MIME types cho phép
  const allowedMimeTypes = [
    // Hình ảnh
    'image/jpeg', 
    'image/png', 
    'image/webp',
    // 3D Models
    'model/gltf-binary',
    'model/gltf+json',
    'application/octet-stream' // Cho các file .glb
  ];
  
  // Danh sách các phần mở rộng cho phép
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.glb', '.gltf'];
  
  const extension = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Please upload an image or 3D model.'));
  }
};

// Cấu hình multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // Giới hạn 20MB
  }
});

// Xử lý tải lên file đơn
export const uploadSingleFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const file = req.file;
    const relatedProductId = req.body.productId ? parseInt(req.body.productId) : null;
    const category = req.body.category || 'product-image';
    
    // Xử lý hình ảnh nếu là file ảnh
    let fileUrl = `/${file.path}`;
    let publicUrl = fileUrl;
    
    if (file.mimetype.startsWith('image/')) {
      // Tạo thumbnail
      const thumbPath = path.join(
        path.dirname(file.path),
        `thumb_${path.basename(file.path)}`
      );
      
      await sharp(file.path)
        .resize(300, 300, { fit: 'inside' })
        .toFile(thumbPath);
      
      // Tối ưu hóa hình ảnh gốc
      await sharp(file.path)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(`${file.path}.optimized.jpg`);
      
      // Cập nhật đường dẫn
      publicUrl = `/${thumbPath}`;
    }
    
    // Lưu thông tin file vào cơ sở dữ liệu
    const newAsset: InsertAsset = {
      fileName: file.filename,
      fileType: path.extname(file.originalname).substring(1), // Loại bỏ dấu . ở đầu phần mở rộng
      fileSize: file.size,
      fileUrl,
      originalName: file.originalname,
      mimeType: file.mimetype,
      category,
      relatedProductId,
      publicUrl
    };
    
    const [insertedAsset] = await db.insert(assets).values(newAsset).returning();
    
    return res.status(201).json(insertedAsset);
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
};

// Lấy danh sách tất cả assets
export const getAllAssets = async (req: Request, res: Response) => {
  try {
    const allAssets = await db.select().from(assets);
    return res.json(allAssets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return res.status(500).json({ error: 'Failed to fetch assets' });
  }
};

// Lấy asset theo ID
export const getAssetById = async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.id);
    if (isNaN(assetId)) {
      return res.status(400).json({ error: 'Invalid asset ID' });
    }
    
    const [asset] = await db.select().from(assets).where(eq(assets.id, assetId));
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    return res.json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    return res.status(500).json({ error: 'Failed to fetch asset' });
  }
};

// Lấy assets theo product ID
export const getAssetsByProduct = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    const productAssets = await db
      .select()
      .from(assets)
      .where(eq(assets.relatedProductId, productId));
    
    return res.json(productAssets);
  } catch (error) {
    console.error('Error fetching product assets:', error);
    return res.status(500).json({ error: 'Failed to fetch product assets' });
  }
};

// Xoá asset theo ID
export const deleteAsset = async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.id);
    if (isNaN(assetId)) {
      return res.status(400).json({ error: 'Invalid asset ID' });
    }
    
    // Lấy thông tin asset trước khi xoá
    const [asset] = await db.select().from(assets).where(eq(assets.id, assetId));
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    // Xoá file vật lý
    const filePath = path.join(process.cwd(), asset.fileUrl.substring(1)); // Bỏ dấu / ở đầu
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      
      // Xoá thumbnail nếu là hình ảnh
      if (asset.mimeType.startsWith('image/')) {
        const thumbPath = path.join(
          path.dirname(filePath),
          `thumb_${path.basename(filePath)}`
        );
        if (fs.existsSync(thumbPath)) {
          fs.unlinkSync(thumbPath);
        }
      }
    }
    
    // Xoá khỏi database
    await db.delete(assets).where(eq(assets.id, assetId));
    
    return res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return res.status(500).json({ error: 'Failed to delete asset' });
  }
};