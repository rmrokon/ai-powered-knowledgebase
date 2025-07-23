import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import sharp from 'sharp'; // for image processing
import fs from 'fs/promises';

const prisma = new PrismaClient();

interface UploadResult {
  id: string;
  url: string;  
  type: string;
  width?: number;
  height?: number;
}

export class AssetService {
  private uploadDir = process.env.UPLOAD_DIR || './uploads';
  private baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  async uploadAsset(
    file: Buffer, 
    originalName: string, 
    mimeType: string,
    articleId?: string
  ): Promise<UploadResult> {
    const fileId = uuidv4();
    const extension = path.extname(originalName);
    const filename = `${fileId}${extension}`;
    const filePath = path.join(this.uploadDir, filename);
    
    // Ensure upload directory exists
    await fs.mkdir(this.uploadDir, { recursive: true });
    
    // Process image if needed
    let width: number | undefined;
    let height: number | undefined;
    let processedBuffer = file;
    
    if (mimeType.startsWith('image/')) {
      const image = sharp(file);
      const metadata = await image.metadata();
      width = metadata.width;
      height = metadata.height;
      
      // Optionally resize large images
      if (width && width > 2000) {
        processedBuffer = await image
          .resize(2000, null, { withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
      }
    }
    
    // Save file
    await fs.writeFile(filePath, processedBuffer);
    
    // Save to database
    const asset = await prisma.asset.create({
      data: {
        id: fileId,
        filename,
        originalName,
        url: `${this.baseUrl}/uploads/${filename}`,
        type: this.getAssetType(mimeType),
        mimeType,
        size: processedBuffer.length,
        width,
        height,
        articleId
      }
    });
    
    return {
      id: asset.id,
      url: asset.url,
      type: asset.type,
      width: asset.width || undefined,
      height: asset.height || undefined
    };
  }
  
  private getAssetType(mimeType: string): 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO' {
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.startsWith('video/')) return 'VIDEO';  
    if (mimeType.startsWith('audio/')) return 'AUDIO';
    return 'DOCUMENT';
  }
  
  async getAssetsByIds(assetIds: string[]) {
    return prisma.asset.findMany({
      where: {
        id: { in: assetIds }
      }
    });
  }
}