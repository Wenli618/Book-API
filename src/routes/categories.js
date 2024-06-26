const express = require('express')
const { getAllCategories, createCategory, editCategory, deleteCategory, getCategoryById } = require('../controllers/categories')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const router = express.Router()


router.get('/', getAllCategories)
router.get('/:id',getCategoryById)
router.post('/', [auth, admin], createCategory)
router.put('/:id', [auth, admin], editCategory)
router.delete('/:id', [auth, admin], deleteCategory)



module.exports = router