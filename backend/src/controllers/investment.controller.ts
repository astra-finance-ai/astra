import { Request, Response, NextFunction } from 'express';
import { Investment } from '../models/Investment.model';

export class InvestmentController {
  // GET /api/investments - Get user's investments
  async getInvestments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id.toString();
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string;

      const query: any = { user: userId };
      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit;

      const [investments, total] = await Promise.all([
        Investment.find(query)
          .populate('asset', 'name slug coverImageUrl projectedAnnualYield status')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Investment.countDocuments(query),
      ]);

      res.json({
        success: true,
        data: investments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/investments/:id - Get single investment
  async getInvestment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id.toString();
      const investmentId = req.params.id;

      const investment = await Investment.findOne({
        _id: investmentId,
        user: userId,
      }).populate('asset');

      if (!investment) {
        return res.status(404).json({ error: 'Investment not found' });
      }

      res.json({
        success: true,
        data: investment,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/investments/portfolio/summary - Portfolio stats
  async getPortfolioSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id.toString();

      const stats = await Investment.aggregate([
        { $match: { user: new require('mongoose').Types.ObjectId(userId), status: 'confirmed' } },
        {
          $group: {
            _id: null,
            totalInvestedUsd: { $sum: '$amountUsd' },
            totalYieldEarnedUsd: { $sum: '$totalYieldEarnedUsd' },
            totalYieldClaimedUsd: { $sum: '$totalYieldClaimedUsd' },
            count: { $sum: 1 },
          },
        },
      ]);

      const summary = stats[0] || {
        totalInvestedUsd: 0,
        totalYieldEarnedUsd: 0,
        totalYieldClaimedUsd: 0,
        count: 0,
      };

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const investmentController = new InvestmentController();
