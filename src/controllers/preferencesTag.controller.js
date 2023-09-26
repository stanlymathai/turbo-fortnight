const {
  getPreferencesTagData,addpreferencesTag,addUserTag,getUserTagData
} = require('../services/preferencesTag.service');
const constants  =require('../utils/responseMessage.util')

async function userAddTag(req, res) {
  try {
    const result = await addUserTag(req);
    if(result.status){
      const responseData ={
        "success": true,
        'msg':constants.MESSAGES.DATA_ADDED,
        "data":result.data
      }
     res.status(200).json(responseData);
    }
    else{
      const responseData ={
        "success": false,
        'msg':constants.MESSAGES.DATA_NOT_ADDED,
        "data":result.data
      }
     res.status(200).json(responseData);
    }
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}

async function getTagList(req, res) {
  try {
    const result = await getPreferencesTagData(req);
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

async function getUserTagList(req, res) {
  try {
    const result = await getUserTagData(req);
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

async function addTag(req, res) {
  const preferencesTagData = req.body;
  
  if (!preferencesTagData) {
    return res
      .status(400)
      .send('Missing Preferences Tag data in request body.');
  }

  try {
    const result = await addpreferencesTag(req);
    if(result.status == 1){
      const responseData ={
        "success": true,
        'msg':constants.MESSAGES.DATA_FOUND,
        "data":result.data
      }
     res.status(201).json(responseData);
    }
    else if(result.status == 2){
      const responseData ={
        "success": true,
        'msg':result.msg,
        "data":result.data
      }
     res.status(201).json(responseData);
    }
    else{
      const responseData ={
        "success": false,
        'msg':constants.MESSAGES.DATA_FOUND,
        "data":result.data
      }
     res.status(201).json(responseData);
    }
  
  } catch (error) {
    console.error('Error Add Preferences Tag:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}


module.exports = {
  getTagList,addTag,userAddTag,getUserTagList
};
