const gremlin = require('gremlin');
const t = gremlin.process.t



async function getPreferencesTagData(req) {
  return await req.dbClient.g.V().hasLabel('preferencesTag').valueMap(true).toList();
}

async function getUserTagData(req) {
  return await req.dbClient.g.V().hasLabel('User')
  .has('email',req.body.email)
  .out('TAGWITH')
  .valueMap(true).toList(); 
}


async function addpreferencesTag(req) {
  const preferencesTag = req.body;

  const preferencesVertex = await req.dbClient.g.V().hasLabel('preferencesTag').hasNext();

 if (!preferencesVertex) {
  await req.dbClient.g.addV().label('preferencesTag')
  } 

  const TagExists = await req.dbClient.g.V()
  .hasLabel('preferencesTag')
  .has('name', preferencesTag.name)
  .hasNext();

if (!TagExists) {
  const queryData= await req.dbClient.g.addV('preferencesTag')
  .property('name', preferencesTag.name)
  .property('descriptions', preferencesTag.descriptions)
  .next();
        return queryData;
} else {
  
   return "This preferences tag is already exists"
}
}

async function addUserTag(req) {
  return await req.dbClient.g.V().hasLabel('preferencesTag').has('name',req.body.tagName).as('a').V().hasLabel('User').has('email',req.body.personEmailId).addE('TAGWITH').to('a').property('createdDate',Date.now()).next();
}

module.exports = {
 getPreferencesTagData,addpreferencesTag,addUserTag,getUserTagData
};
