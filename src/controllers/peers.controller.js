const {
  addRelationship,UserRequestList
 ,userPeersList,peersContactList,searchPeers,addPeerRequest
} = require('../services/peers.service');
const constants  =require('../utils/responseMessage.util');

async function addPeers(req, res) {
  try {
    const result = await addRelationship(req);
    if(result.status){
      const responseData ={
        "success": true,
        'msg':constants.MESSAGES.PEERS_ADDED,
        "data":result.data
      }
     res.status(201).json(responseData);
    }
    else{
      const responseData ={
        "success": false,
        'msg':constants.MESSAGES.PEERS_NOT_ADDED,
        "data":result.data
      }
     res.status(201).json(responseData);
    }
   
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}

async function sentPeerRequest(req, res) {
  try {
    const result = await addPeerRequest(req);
    if(result.status){
      const responseData ={
        "success": true,
        'msg':constants.MESSAGES.PEERS_REQUEST_ADDED,
        "data":result.data
      }
     res.status(201).json(responseData);
    }
    else{
      const responseData ={
        "success": false,
        'msg':constants.MESSAGES.PEERS_REQUEST_NOT_ADDED,
        "data":result.data
      }
     res.status(201).json(responseData);
    }
   
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}

async function peersSearch(req, res) {
  try {
    const result = await searchPeers(req);
    if(result.status){
      const responseData ={
        "success": true,
        'msg':constants.MESSAGES.PEERS_ADDED,
        "data":result.data
      }
     res.status(201).json(responseData);
    }
    else{
      const responseData ={
        "success": false,
        'msg':constants.MESSAGES.PEERS_NOT_ADDED,
        "data":result.data
      }
     res.status(201).json(responseData);
    }
   
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}


async function getUserPeersList(req, res) {
  try {
    const result = await userPeersList(req);
    if(result.status){
      const responseData ={
        "success": true,
        'msg':constants.MESSAGES.DATA_FOUND,
        "data":result.data
      }
     res.status(200).json(responseData);
    }
    else{
      const responseData ={
        "success": false,
        'msg':constants.MESSAGES.DATA_NOT_FOUND,
        "data":result.data
      }
     res.status(200).json(responseData);
    }
   
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}

async function getUserRequestList(req, res) {
  try {
    const result = await UserRequestList(req);
    if(result.status){
      const responseData ={
        "success": true,
        'msg':constants.MESSAGES.DATA_FOUND,
        "data":result.data
      }
     res.status(200).json(responseData);
    }
    else{
      const responseData ={
        "success": false,
        'msg':constants.MESSAGES.DATA_NOT_FOUND,
        "data":result.data
      }
     res.status(200).json(responseData);
    }
   
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}



async function getPeersContactList(req, res) {
  try {
    const result = await peersContactList(req);
    if(result.status){
      const responseData ={
        "success": true,
        'msg':constants.MESSAGES.DATA_FOUND,
        "data":result.data
      }
     res.status(200).json(responseData);
    }
    else{
      const responseData ={
        "success": false,
        'msg':constants.MESSAGES.DATA_FOUND,
        "data":result.data
      }
     res.status(200).json(responseData);
    }
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}


module.exports = {
getPeersContactList,getUserPeersList,addPeers,peersSearch,sentPeerRequest,getUserRequestList
  
};
