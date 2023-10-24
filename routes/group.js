const express = require('express')
const { createGroupController, addUserToGroupController } = require('../controllers/group')

//Router Object
const router = express.Router()

//Routes

//Create Group
router.post('/createGroup', createGroupController)
router.post('/addUserToGroup', addUserToGroupController)

module.exports = router