const {searchQueryHandler,joinGroupHandler,createGroupHandler,addParticipant, groupDataHandler,joinRequestResponseHandler,leaveGroupHandler} = require('../controllers/chatController');
const auth = require('../middlewares/auth');

const router = require('express').Router();

router.get('/search', auth, searchQueryHandler);
router.post('/join-group', auth, joinGroupHandler);
router.post('/create-group',auth, createGroupHandler);
router.post('/add-participant',auth,addParticipant);
router.get('/group',auth,groupDataHandler);
router.put('/join-request-response',auth,joinRequestResponseHandler);
router.delete('/leave-group',auth,leaveGroupHandler);

module.exports = router;