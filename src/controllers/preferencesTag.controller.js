const {
  getPreferencesTagData,addpreferencesTag,addUserTag,getUserTagData
} = require('../services/preferencesTag.service');

async function userAddTag(req, res) {
  try {
    const persons = await addUserTag(req);
    res.json(persons);
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}

async function getTagList(req, res) {
  try {
    const persons = await getPreferencesTagData(req);
    res.json(persons);
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}

async function getUserTagList(req, res) {
  try {
    const persons = await getUserTagData(req);
    res.json(persons);
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
   res.status(201).json({data:result});
  } catch (error) {
    console.error('Error Add Preferences Tag:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}


module.exports = {
  getTagList,addTag,userAddTag,getUserTagList
};
