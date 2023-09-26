
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
  const user=req.user.email;
  const queryData= await req.dbClient.g.V().hasLabel('User')
  .has('email', user).valueMap(true).toList();
  if(queryData.length >= 1){
    return {"status":1,"data":queryData[0]};
  }else{
    return {"status":0,"data":queryData};
  }
}


async function profileUpdate(req) {
  const getData = req.body;
  const user=req.user.email;

  const queryData = await req.dbClient.g.V()
  .hasLabel('User')
  .has('email', user)
  .property('bannerImage', getData.bannerImage)
  .property('profileImage', getData.profileImage)
  .property('profileDescription', getData.profileDescription).valueMap(true).toList();
    
        if(queryData.length >= 1){
          return {"status":1,"data":queryData[0]};
        }else{
          return {"status":0,"data":queryData};
        }
  
}

module.exports = {
  addPersonVertex,
  addRelationship,
  getAllPersons,getProfileData,profileUpdate
};
