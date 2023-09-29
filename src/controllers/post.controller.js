const {
    addPostData,getUserPostData
  } = require('../services/post.service');
  const constants  =require('../utils/responseMessage.util');
  
  async function addPost(req, res) {
    try {
      const result = await addPostData(req);
      if(result.status){
        const responseData ={
          "success": true,
          'msg':constants.MESSAGES.DATA_ADDED,
          "data":result.data
        }
       res.status(201).json(responseData);
      }
      else{
        const responseData ={
          "success": false,
          'msg':constants.MESSAGES.DATA_NOT_ADDED,
          "data":result.data
        }
       res.status(201).json(responseData);
      }
   
    } catch (error) {
      console.error('Error fetching persons:', error);
      res.status(500).send('An error occurred while processing your request.');
    }
  }
  
  async function getUserPostList(req, res) {
    try {
      const result = await getUserPostData(req);
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
  
  
  module.exports = { addPost,getUserPostList};
  