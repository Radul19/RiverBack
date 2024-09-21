import { Router } from 'express'
import * as guest from '../controllers/guest'

const router = Router()

router.get('/', guest.test)

router.post('/login', guest.login)
router.post('/register', guest.register)
router.post('/searchItems', guest.searchItems)

router.get('/getItem/:id', guest.getItem)
router.get('/getMarket/:id', guest.getMarket)

export default router
// module.exports = router
// XRH7J5O2OZJ6T1EGNTONG8PG30PIXJJA