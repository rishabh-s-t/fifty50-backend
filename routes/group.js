const express = require('express');
const {
  createGroupController,
  addUserToGroupController,
  getGroupFromInviteController,
  deleteGroupController,
  getAllGroupsFromMemberId,
  getExpenseController,
  getGroupsFromIdController,
} = require('../controllers/group');

//Router Object
const router = express.Router();

//Routes
router.post('/createGroup', createGroupController);
router.post('/:groupId/member/:memberId', addUserToGroupController);
router.get('/invite/:groupId', getGroupFromInviteController); //Invite ID
router.delete('/:groupId', deleteGroupController);
router.get('/member/:memberId', getAllGroupsFromMemberId);
router.get('/expense/:groupId', getExpenseController);
router.get('/groups', getGroupsFromIdController);

module.exports = router;
