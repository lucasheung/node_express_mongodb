import express from 'express';
import { createStockRecord, getAllStock, addPosition, getUserPositions, updateUserPosition, deletePosition } from '../controller/stock.controller';

export const router = express.Router();

router.get('/all', getAllStock);
router.post('/add', createStockRecord);
router.post('/addPosition', addPosition)
router.get('/getPosition/:username', getUserPositions)
router.put('/updatePosition/:username', updateUserPosition)
router.delete('/deletePosition/:username', deletePosition)
export default router;
