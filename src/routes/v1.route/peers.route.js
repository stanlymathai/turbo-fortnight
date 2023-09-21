const express = require('express');
const router = express.Router();

const controller = require('../../controllers/peers.controller');
router.post('/addpeers', controller.addPeers);
router.post('/get_user_peers_list', controller.getUserPeersList);
router.post('/get_peers_contact_list', controller.getPeersContactList);
module.exports = router;
