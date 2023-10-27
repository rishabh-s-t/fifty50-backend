const express = require('express');
const {
  createGroupController,
  addUserToGroupController,
  getGroupController,
  deleteGroupController,
  getAllGroupsFromMemberId,
  getExpenseController,
} = require('../controllers/group');

//Router Object
const router = express.Router();

//Routes

//Create Group
router.post('/createGroup', createGroupController);
router.post('/:groupId/member/:memberId', addUserToGroupController);
router.get('/:groupId', getGroupController);
router.delete('/:groupId', deleteGroupController);
router.get('/member/:memberId', getAllGroupsFromMemberId);
router.get('/expense/:groupId', getExpenseController);

module.exports = router;
