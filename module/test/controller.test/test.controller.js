const { conn } = require('../../../service/db');

const testing = async (_, res) => {
  let client;
  try {
    client = await conn.acquire();
    const v1 = await client.g.addV('person').property('name', 'Jerry').next();
    const v2 = await client.g.addV('person').property('name', 'Maquire').next();

    const result = await client.g
      .V(v1.value)
      .addE('knows')
      .to(v2.value)
      .property('weight', 0.75)
      .iterate();

    res.json(result);
  } catch (error) {
    console.error('Error adding persons and relationship:', error);
    res.status(500).send('An error occurred while processing your request.');
  } finally {
    if (client) {
      conn.release(client);
    }
  }
};

const getPersons = async (_, res) => {
  let client;
  try {
    client = await conn.acquire();
    const result = await client.g.V().valueMap(true).toList();
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    if (client) {
      conn.release(client);
    }
  }
};
module.exports = { testing, getPersons };
