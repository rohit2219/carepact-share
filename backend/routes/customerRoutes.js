import express from 'express'
import { getCustomerDetails, getCustomerDetailsByCustomerUniqoeId, saveCustomerDetails } from '../controllers/customerController.js';
const router = express.Router();

router.post('/customerdetail', saveCustomerDetails)
router.get('/customerdetail', getCustomerDetails)
router.get('/customerdetail/:uniqueid', getCustomerDetailsByCustomerUniqoeId)

export default router