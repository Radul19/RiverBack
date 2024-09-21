import { Router } from 'express'
import * as com from '../controllers/commerce'

const router = Router()


router.post('/registerCommerce', com.registerCommerce)
router.post('/editMarketData', com.editMarketData)
router.post('/createItem', com.createItem)
router.post('/updateItem', com.updateItem)
router.post('/deleteItem', com.deleteItem)

export default router