import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { investmentController } from '../controllers/investment.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', investmentController.getInvestments.bind(investmentController));
router.get('/:id', investmentController.getInvestment.bind(investmentController));
router.get('/portfolio/summary', investmentController.getPortfolioSummary.bind(investmentController));

export default router;
