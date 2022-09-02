import express from 'express'
import { saveCustomerLogs, getCustomerLogs, verifyProduct, deletecustLogByid } from '../controllers/customerLogsController.js';
const router = express.Router();

// router.post('/custlogs', saveCustomerLogs)
router.get('/custlogs', getCustomerLogs)
router.patch('/custlogs/:id', verifyProduct)
router.delete('/custlogs/:id', deletecustLogByid)

export default router