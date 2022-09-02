import express from 'express'
const router = express.Router();
import { getIpAddress } from '../controllers/ipController.js'

router.get('/ipaddress', getIpAddress)

export default router  