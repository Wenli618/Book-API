const express = require('express')
const auth = require('../middleware/auth')
const {getUserCollections, createUserCollection, deleteCollection } = require('../controllers/collections')

const router = express.Router()

router.get('/', auth, getUserCollections)
router.post('/', auth, createUserCollection)
router.delete('/:id', auth, deleteCollection)


module.exports = router
