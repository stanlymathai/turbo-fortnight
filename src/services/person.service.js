async function addPersonVertex(req, name) {
  return await req.dbClient.g.addV('person').property('name', name).next();
}

async function addRelationship(req, v1, v2, weight) {
  return await req.dbClient.g
    .V(v1.value)
    .addE('knows')
    .to(v2.value)
    .property('weight', weight)
    .iterate();
}

async function getAllPersons(req) {
  return await req.dbClient.g.V().valueMap(true).toList();
}

module.exports = {
  addPersonVertex,
  addRelationship,
  getAllPersons,
};
