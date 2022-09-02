import express from 'express'
const router = express.Router()
import {
    getData,
    suggestions,
    getproducts,
    cancelitem,
    addReturn,
    getreturn,
    creditupdate,
    getreturndetails,
    getProductData,
    insertReturn,
    testdata,
    getUploadpurchases
} from '../controllers/purchaseReturnController.js'

router.get('/getdata', getData)
router.post('/suggestions', suggestions)
router.get('/getproducts/:id', getproducts)
router.post('/addReturn', addReturn)
router.get('/getreturn', getreturn)
router.get('/getreturndetails/:id', getreturndetails)
router.get('/getProductData/:id', getProductData)
router.post('/insertReturn', insertReturn)
router.get('/testdata/:id', testdata)
router.post('/cancelitem/:id', cancelitem)
router.post('/creditupdate/:id', creditupdate)
router.get('/uploadedpurchases', getUploadpurchases)

export default router