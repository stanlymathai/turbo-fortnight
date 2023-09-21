
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

async function getProfileData(req) {
  return await req.dbClient.g.V().hasLabel('User')
  .has('email', req.body.email).valueMap(true).toList();
}

async function signUp(req) {
  const signupData = req.body;

  const personVertex = await req.dbClient.g.V().hasLabel('User').hasNext();

 if (!personVertex) {
  await req.dbClient.g.addV().label('User')
  } 

  const personExists = await req.dbClient.g.V()
  .hasLabel('User')
  .has('email', signupData.email)
  .hasNext();

if (!personExists) {
  const queryData= await req.dbClient.g.addV('User')
  .property('name', signupData.name)
  .property('email', signupData.email)
  .property('dateOfBirth', signupData.dateOfBirth)
  .property('residency', signupData.residency)
  .property('bannerImage', signupData.bannerImage)
  .property('profileImage', signupData.profileImage)
  .property('profileDescription', signupData.profileDescription).next();
        return queryData;
} else {
  
   return "This email id is already exists"
}
}


async function profileUpdate(req) {
  const getData = req.body;

  const personExists = await req.dbClient.g.V()
  .hasLabel('User')
  .has('email', getData.email)
  .hasNext();

if (personExists) {
  const queryData = await req.dbClient.g.V()
  .hasLabel('User')
  .has('email', getData.email)
  .property('bannerImage', getData.bannerImage)
  .property('profileImage', getData.profileImage)
  .property('profileDescription', getData.profileDescription).next();
        return queryData;
} else {
  
   return "This email id is not exists"
}
}

module.exports = {
  addPersonVertex,
  addRelationship,
  getAllPersons,signUp,getProfileData,profileUpdate
};
