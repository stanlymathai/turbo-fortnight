const {
  addPersonVertex,
  addRelationship,
  getAllPersons,signUp,getProfileData,profileUpdate
} = require('../services/person.service');
const constants  =require('../utils/responseMessage.util')

async function addPerson(req, res) {
  const personOne = req.body.personOne;
  const personTwo = req.body.personTwo;

  if (!personOne || !personTwo) {
    return res
      .status(400)
      .send('Missing personOne or personTwo in request body.');
  }

  try {
    const v1 = await addPersonVertex(req, personOne);
    const v2 = await addPersonVertex(req, personTwo);
    const result = await addRelationship(req, v1, v2, 0.75);

    res.status(201).json({v1, v2, result});
  } catch (error) {
    console.error('Error adding persons and relationship:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}

async function getPersons(req, res) {
  try {
    const persons = await getAllPersons(req);
    res.json(persons);
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}



async function getProfile(req, res) {
  try {
    const result = await getProfileData(req);
    if(result.status){
      const responseData ={
        "success": true,
        'msg':constants.MESSAGES.DATA_FOUND,
        "data":result.data
      }
     res.status(201).json(responseData);
    }
    else{
      const responseData ={
        "success": false,
        'msg':constants.MESSAGES.DATA_NOT_FOUND,
        "data":result.data
      }
     res.status(201).json(responseData);
    }
   
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}




async function updateProfile(req, res) {
  const updateProfileData = req.body;
  if (!updateProfileData) {
    return res
      .status(400)
      .send('Missing profile data in request body.');
  }

  try {
    const result = await profileUpdate(req);

    if(result.status){
      const responseData ={
        "success": true,
        'msg':constants.MESSAGES.DATA_UPDATED,
        "data":result.data
      }
     res.status(201).json(responseData);
    }
    else{
      const responseData ={
        "success": false,
        'msg':constants.MESSAGES.DATA_UPDATED,
        "data":result.data
      }
     res.status(201).json(responseData);
    }
  
  } catch (error) {
    console.error('Error adding persons and relationship:', error);
    const responseData ={
      "success": false,
      'msg':'An error occurred while processing your request.',
      "data":''
    }
   res.status(500).json(responseData);
  }
}


module.exports = {
  addPerson,
  getPersons,getProfile,updateProfile
};
