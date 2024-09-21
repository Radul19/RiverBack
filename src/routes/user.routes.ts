import { Router } from 'express'
const router = Router()

import * as user from '../controllers/user'


// router.get('/', test)
router.get('/createCode', user.createCode)
router.post('/orderHistory', user.orderHistory)

router.post('/editUserData', user.editUserData)
router.post('/existCode', user.existCode)
router.post('/searchFavorites', user.searchFavorites)
router.post('/updateReview', user.updateReview)
router.post('/validateToken', user.validateToken)

router.post('/itemFavorite', user.itemFavorite)
router.post('/marketFavorite', user.marketFavorite)

export default router
// module.exports = router
// XRH7J5O2OZJ6T1EGNTONG8PG30PIXJJA