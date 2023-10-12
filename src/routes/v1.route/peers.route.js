const express = require('express');
const router = express.Router();
const controller = require('../../controllers/peers.controller');
const verify_token = require('../../middlewares/auth.middleware');

router.post('/addpeers',[verify_token], controller.addPeers);
router.get('/get_user_peers_list',[verify_token], controller.getUserPeersList);
router.get('/get_peers_contact_list',[verify_token], controller.getPeersContactList);
router.post('/search',[verify_token], controller.peersSearch);
router.post('/sent_request',[verify_token], controller.sentPeerRequest);
router.get('/user_request_list',[verify_token], controller.getUserRequestList);
module.exports = router;
