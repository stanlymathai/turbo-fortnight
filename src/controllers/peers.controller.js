const {
  addRelationship
 ,userPeersList,peersContactList
} = require('../services/peers.service');


async function addPeers(req, res) {
  try {
    const persons = await addRelationship(req);
    res.json(persons);
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}


async function getUserPeersList(req, res) {
  try {
    const persons = await userPeersList(req);
    res.json(persons);
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}

async function getPeersContactList(req, res) {
  try {
    const persons = await peersContactList(req);
    res.json(persons);
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}


module.exports = {
getPeersContactList,getUserPeersList,addPeers
  
};
