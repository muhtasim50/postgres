const router = require('express').Router()
const categoryCtrl = require('../controllers/categoryCtrl')
const autho = require('../middleware/autho')
const authoAdmin = require('../middleware/authoAdmin')

router.route('/category')
    .get(categoryCtrl.getCategories)
    .post(autho, authoAdmin, categoryCtrl.createCategory)

module.exports = router