const express = require('express');
const {
  createGroupController,
  addUserToGroupController,
  getGroupController,
} = require('../controllers/group');

//Router Object
const router = express.Router();

//Routes

//Create Group
router.post('/createGroup', createGroupController);
router.post('/:groupId/member/:memberId', addUserToGroupController);
router.get('/:groupId', getGroupController);

module.exports = router;
