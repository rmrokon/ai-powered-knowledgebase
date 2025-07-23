import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ContentBlock {
  id: string;
  type: string;
  data: any;
}

interface ResolvedContent {
  blocks: ContentBlock[];
  assets: Record<string, any>; // Asset ID -> Asset data
}

export class ContentResolver {
  
  /**
   * Extract all asset IDs from content JSON
   */
  extractAssetIds(content: any): string[] {
    const assetIds = new Set<string>();
    
    if (content.blocks) {
      for (const block of content.blocks) {
        this.findAssetIdsInBlock(block, assetIds);
      }
    }
    
    return Array.from(assetIds);
  }
  
  private findAssetIdsInBlock(block: any, assetIds: Set<string>) {
    // Direct asset references
    if (block.data?.assetId) {
      assetIds.add(block.data.assetId);
    }
    
    // Array of asset IDs (like gallery)
    if (block.data?.assetIds && Array.isArray(block.data.assetIds)) {
      block.data.assetIds.forEach((id: string) => assetIds.add(id));
    }
    
    // Poster images for videos
    if (block.data?.poster) {
      assetIds.add(block.data.poster);
    }
    
    // Inline assets in text (regex search)
    if (block.data?.text && typeof block.data.text === 'string') {
      const inlineAssetRegex = /assetId="([^"]+)"/g;
      let match;
      while ((match = inlineAssetRegex.exec(block.data.text)) !== null) {
        assetIds.add(match[1]);
      }
    }
    
    // Recursively search nested structures
    if (typeof block.data === 'object') {
      Object.values(block.data).forEach(value => {
        if (typeof value === 'object' && value !== null) {
          this.findAssetIdsInBlock({ data: value }, assetIds);
        }
      });
    }
  }
  
  /**
   * Resolve content with asset data
   */
  async resolveContent(content: any): Promise<ResolvedContent> {
    const assetIds = this.extractAssetIds(content);
    
    // Fetch all assets in one query
    const assets = await prisma.asset.findMany({
      where: {
        id: { in: assetIds }
      }
    });
    
    // Create asset lookup map
    const assetMap: Record<string, any> = {};
    assets.forEach(asset => {
      assetMap[asset.id] = {
        id: asset.id,
        url: asset.url,
        type: asset.type,
        width: asset.width,
        height: asset.height,
        originalName: asset.originalName,
        mimeType: asset.mimeType
      };
    });
    
    return {
      blocks: content.blocks || [],
      assets: assetMap
    };
  }
  
  /**
   * Update article with asset associations
   */
  async updateArticleAssets(articleId: string, content: any) {
    const assetIds = this.extractAssetIds(content);
    
    // Update all referenced assets to belong to this article
    await prisma.asset.updateMany({
      where: {
        id: { in: assetIds }
      },
      data: {
        articleId: articleId
      }
    });
    
    // Remove association for assets no longer used
    await prisma.asset.updateMany({
      where: {
        articleId: articleId,
        id: { notIn: assetIds }
      },
      data: {
        articleId: null
      }
    });
  }
}