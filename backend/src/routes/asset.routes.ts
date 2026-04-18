import { Router } from 'express';
import { assetController } from '../controllers/asset.controller';

const router = Router();

// Public routes - no auth required
router.get('/', assetController.listAssets);
router.get('/:slug', assetController.getAssetBySlug);
router.get('/search', assetController.searchAssets);
router.get('/region/:region', assetController.getAssetsByRegion);
router.get('/trending', assetController.getTrendingAssets);

export const assetRoutes = router;
