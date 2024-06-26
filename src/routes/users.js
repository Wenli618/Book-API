const express = require('express')
const router = express.Router()
const { getUserByTokenId, createUser,editUser } = require('../controllers/users')
const auth = require('../middleware/auth')


router.post('/', createUser)
router.get('/me', auth, getUserByTokenId)
router.put('/me', auth, editUser)
module.exports = router