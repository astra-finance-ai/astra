import { Request, Response } from 'express';
import { Asset } from '../models/Asset.model';

export const assetController = {
  async listAssets(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, region, type, status = 'active' } = req.query;
      
      const query: any = { status };
      
      if (region) query.region = region;
      if (type) query.type = type;

      const assets = await Asset.find(query)
        .populate('aiScoreId')
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .sort({ createdAt: -1 });

      const total = await Asset.countDocuments(query);

      res.json({
        assets,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error: any) {
      throw error;
    }
  },

  async getAssetBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      
      const asset = await Asset.findOne({ slug })
        .populate('aiScoreId')
        .populate('createdBy', 'fullName');

      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }

      res.json({ asset });
    } catch (error: any) {
      throw error;
    }
  },

  async searchAssets(req: Request, res: Response) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const assets = await Asset.find({
        $or: [
          { name: { $regex: q as string, $options: 'i' } },
          { location: { $regex: q as string, $options: 'i' } },
          { description: { $regex: q as string, $options: 'i' } }
        ],
        status: 'active'
      })
        .limit(20)
        .populate('aiScoreId');

      res.json({ assets });
    } catch (error: any) {
      throw error;
    }
  },

  async getAssetsByRegion(req: Request, res: Response) {
    try {
      const { region } = req.params;
      
      const assets = await Asset.find({ region, status: 'active' })
        .populate('aiScoreId')
        .sort({ projectedAnnualYield: -1 });

      res.json({ assets });
    } catch (error: any) {
      throw error;
    }
  },

  async getTrendingAssets(req: Request, res: Response) {
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const assets = await Asset.find({
        status: 'active',
        publishedAt: { $gte: oneWeekAgo }
      })
        .populate('aiScoreId')
        .sort({ totalRaisedUsd: -1 })
        .limit(10);

      res.json({ assets });
    } catch (error: any) {
      throw error;
    }
  }
};
