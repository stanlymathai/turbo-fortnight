const { g, closeConn } = require('../../../service/db').gremlinHandler();

const testing = async (req, res) => {
  const v1 = await g.addV('person').property('name', 'marko').next();
  const v2 = await g.addV('person').property('name', 'stephen').next();
  console.log('v1 and v2 knri', v1.value, v2);
  await g
    .V(v1.value)
    .addE('knows')
    .to(v2.value)
    .property('weight', 0.75)
    .iterate()
    .then((result) => {
      console.log('result', result);
      closeConn();
      res.status(200).json({ message: 'testing' });
    })
    .catch((err) => {
      closeConn();
      console.log('err', err);
    });
};
const getPersons = async (req, res) => {
  const persons = await g.V().valueMap(true).toList();
  console.log('persons', persons);
  closeConn();
  res.json(persons);
};
module.exports = { testing, getPersons };
