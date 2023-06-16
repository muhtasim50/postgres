const router = require('express').Router();
const userCtrl = require('../controllers/userCtrl')
const autho = require('../middleware/autho')

router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.get('/logout', userCtrl.logout)
router.get('/refresh_token', userCtrl.refreshToken)

router.get('/information', autho, userCtrl.getUser)

module.exports = router;