const {
  addPersonVertex,
  addRelationship,
  getAllPersons,
} = require('../services/person.service');

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

module.exports = {
  addPerson,
  getPersons,
};
