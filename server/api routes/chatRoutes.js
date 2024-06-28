const {searchQueryHandler,joinGroupHandler,createGroupHandler,addParticipant, groupDataHandler,joinRequestResponseHandler,leaveGroupHandler} = require('../controllers/chatController');

const router = require('express').Router();

router.get('/search', searchQueryHandler);
router.post('/join-group',joinGroupHandler);
router.post('/create-group',createGroupHandler);
router.post('/add-participant',addParticipant);
router.get('/group',groupDataHandler);
router.put('/join-request-response',joinRequestResponseHandler);
router.delete('/leave-group',leaveGroupHandler);

module.exports = router;