import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { db } from './db';
import { assets, type InsertAsset } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { pool } from './db';
import * as mysql from 'mysql2/promise';

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
    // Client nên gửi category là '3d-model' cho model 3D
    const assetCategory = req.body.category || (file.mimetype.includes('model') || file.originalname.endsWith('.glb') || file.originalname.endsWith('.gltf') ? '3d-model' : 'product-image');
    
    let fileUrl = `/${file.path.replace(/\\/g, '/')}`; // Đảm bảo dùng dấu / cho URL
    let publicUrl = fileUrl;
    
    if (file.mimetype.startsWith('image/')) {
      // Tạo thumbnail
      const thumbPath = path.join(
        path.dirname(file.path),
        `thumb_${path.basename(file.path)}`
      ).replace(/\\/g, '/');
      
      await sharp(file.path)
        .resize(300, 300, { fit: 'inside' })
        .toFile(path.join(process.cwd(), thumbPath.substring(1))); // Cần đường dẫn tuyệt đối cho sharp
      
      const optimizedPath = `${file.path}.optimized.jpg`;
      await sharp(file.path)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(optimizedPath);
      
      publicUrl = `/${thumbPath}`;
      // Xem xét việc cập nhật fileUrl để trỏ đến ảnh đã tối ưu nếu cần
      // fileUrl = `/${optimizedPath.replace(/\\/g, '/').replace(/^public\//i, '')}`;
    }
    
    const newAsset: InsertAsset = {
      fileName: file.filename,
      fileType: path.extname(file.originalname).substring(1),
      fileSize: file.size,
      fileUrl,
      originalName: file.originalname,
      mimeType: file.mimetype,
      category: assetCategory, // Sử dụng assetCategory đã xác định
      relatedProductId,
      publicUrl
    };
    
    const insertedAsset = await db.createAsset(newAsset); // Giả sử db.createAsset trả về asset đã chèn

    // Nếu là model 3D và có relatedProductId, cập nhật watches.modelUrl
    if (insertedAsset && insertedAsset.relatedProductId && assetCategory === '3d-model') {
      try {
        console.log(`Updating watch ${insertedAsset.relatedProductId} with modelUrl: ${insertedAsset.fileUrl}`);
        await db.updateWatch(insertedAsset.relatedProductId, { modelUrl: insertedAsset.fileUrl });
        console.log(`Watch ${insertedAsset.relatedProductId} updated successfully.`);
      } catch (updateError) {
        console.error(`Failed to update watch ${insertedAsset.relatedProductId} with modelUrl:`, updateError);
        // Không block response chính nếu chỉ update watch thất bại, nhưng cần log lại
      }
    }
    
    return res.status(201).json(insertedAsset);
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
};

// Lấy danh sách tất cả assets
export const getAllAssets = async (req: Request, res: Response) => {
  try {
    const [allAssets] = await pool.execute('SELECT * FROM assets') as [any[], any];
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
    const [rows] = await pool.execute('SELECT * FROM assets WHERE id = ?', [assetId]) as [any[], any];
    const asset = rows[0];
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
    const assets = await db.getAssetsByProductId(productId);
    return res.json(assets);
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
    const [rows] = await pool.execute('SELECT * FROM assets WHERE id = ?', [assetId]) as [any[], any];
    const asset = rows[0];
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    // Xoá file vật lý
    const filePath = path.join(process.cwd(), asset.fileUrl.substring(1));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
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
    await pool.execute('DELETE FROM assets WHERE id = ?', [assetId]);
    return res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return res.status(500).json({ error: 'Failed to delete asset' });
  }
};