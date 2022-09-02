import express from 'express'
const router = express.Router();

import {addCustomer} from '../controllers/addUserController.js'
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js'

router.route('/addUser').post(isAuthenticated,addCustomer)

export default router
