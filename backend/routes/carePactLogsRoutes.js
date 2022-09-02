import express from 'express'
import { getCarePactLogs, saveCarePactLogs,awssave,getCarePactLogtosend } from '../controllers/carepactLogsController.js';
const router = express.Router();

// router.post('/carelogs', saveCarePactLogs)
router.get('/carelogs', getCarePactLogs)
router.get('/awssend', getCarePactLogtosend)
router.post('/awssaveflag', awssave)

export default router