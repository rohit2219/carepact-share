import express from 'express'
const router = express.Router()
import {registerSupplier,getSupplierById} from '../controllers/accountController.js'
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js'
import validator from 'express-validator'
const { check, validationResult } = validator

router.route('/register').post([
    check("mobile").isLength({ max: 10 }).withMessage('Mobile must have 10 digit'),
    check("pincode").isLength({ max: 6 }).withMessage('pincode must have 6 digit'),
    check("email").isEmail().withMessage("Email is required") 
],isAuthenticated,registerSupplier)

router.route('/getSupplierdata/:id').get(getSupplierById)

export default router