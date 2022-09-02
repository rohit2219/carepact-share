import express from 'express'
const router = express.Router()
import { getinventory, getInventoryProduct, suggestions, addInventory, inventoryEdit,deleteRecord,grading,insertLog, uploadInventoryDetails,deleteInventory,insertProduct, gettime} from '../controllers/inventoryController.js'
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js'

router.get('/getinventory', getinventory)
router.get('/getInventoryProduct/:id/:batch', getInventoryProduct)
router.post('/insertLog', insertLog)
router.post('/suggestions', suggestions)
router.post('/addInventory', addInventory)
router.post('/inventoryEdit/:batchno/:id', inventoryEdit)
router.post('/deleterecord/:batch/:id',isAuthenticated, deleteRecord)
router.post('/uploadInventoryDetails',deleteInventory, uploadInventoryDetails,insertProduct,grading)
router.get('/gettime',gettime)
export default router