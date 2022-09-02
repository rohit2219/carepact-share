import express from 'express'
const router = express.Router()
import {
    getData,
    itemView,
    mainFormdata,
    suggestions,
    formData,
    saveData,
    manuf_suggestions,
    group_suggestions,
    category_suggestions,
    purchaseHistory,
    productview,
    inventoryPush,
    purchaseEditdata,
    purchaseProductdelete,
    purchaseEditstatus,
    purchaseSavedata,
    verifyUpdate,
    deleteOrderById,
    deleteProduct,
    updateScanningStatus,
    uploadPurchase,
    getUploadpurchases,
    getUploadpurchaseByid,
    deleteUploadedOrderById,
    setPurchaseActiveStatus,
    updatebox,
    deletebox,
    updatecase,
    getboxvalue,
    verifyCount,
    getcasevalue,
    deletecase,
    updateVerification
} from '../controllers/purchaseController.js'
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js'

router.route('/mainform_data').post(isAuthenticated, inventoryPush, mainFormdata)

router.get('/getdata', getData)
router.post('/form_data', formData)
router.post('/savedata', saveData)
router.post('/suggestions', suggestions)
router.post('/purchase_save_data', purchaseSavedata)
router.post('/manuf_suggestions', manuf_suggestions)
router.post('/purchase_edit_update/:id', isAuthenticated, purchaseProductdelete, purchaseEditdata, purchaseEditstatus)
router.post('/group_suggestions', group_suggestions)
router.post('/category_suggestions', category_suggestions)
router.get('/purchasehistory', purchaseHistory)
router.get('/itemview/:id', itemView)
router.get('/productview', productview)
router.post('/verifypurchase/:id', verifyUpdate)
router.get('/deleteOrderById/:id', isAuthenticated, deleteOrderById)
router.get('/deleteProduct/:pid/:id', isAuthenticated, deleteProduct)
router.post('/updateScanningStatus/:pid/:id', updateScanningStatus)
router.post('/uploadPurchase/', uploadPurchase)
router.get('/uploadedpurchases', getUploadpurchases)
router.get('/getUploadpurchase/:id', getUploadpurchaseByid)
router.get('/deleteUploadedOrderById/:id', deleteUploadedOrderById)
router.post('/setpurchaseactivestatus/:id', setPurchaseActiveStatus)
router.post('/deletebox/:name', deletebox)
router.post('/updatebox/:name/:box', updatebox)
router.post('/updatecase/:name/:case', updatecase)
router.get('/getboxvalue/:name', getboxvalue)
router.post('/verifycount/:id/:status', verifyCount)
router.get('/getcasevalue/:name', getcasevalue)
router.post('/deletecase/:name', deletecase)
router.post('/updateVerification/:id', updateVerification)
export default router