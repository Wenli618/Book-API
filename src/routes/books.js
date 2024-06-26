const express = require('express')
const {getAllBooks, createBook, editBook, deleteBook, getBookById } = require('../controllers/books')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const router = express.Router()

router.get('/', getAllBooks)
router.get('/:id',getBookById)
router.post('/', [auth, admin], createBook)
router.put('/:id', [auth, admin], editBook)
router.delete('/:id', [auth, admin], deleteBook)

module.exports = router
