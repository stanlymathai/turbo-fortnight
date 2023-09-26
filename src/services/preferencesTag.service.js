const gremlin = require('gremlin');
const t = gremlin.process.t



async function getPreferencesTagData(req) {
  const queryData= await req.dbClient.g.V().hasLabel('preferencesTag').valueMap(true).toList();
  if(queryData.length >= 1){
    return {"status":1,"data":queryData[0]};
  }else{
    return {"status":0,"data":queryData};
  }
}

async function getUserTagData(req) {
  const user=req.user.email;
  const queryData = await req.dbClient.g.V().hasLabel('User')
  .has('email',user)
  .out('TAGWITH')
  .valueMap(true).toList(); 
  if(queryData.length >= 1){
    return {"status":1,"data":queryData[0]};
  }else{
    return {"status":0,"data":queryData};
  }
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
  .valueMap(true).toList();
  if(queryData.length >= 1){
    return {"status":1,"data":queryData[0]};
  }else{
    return {"status":0,"data":queryData};
  }
        return queryData;
} else {
  return {"status":2,"data":"","msg":"This preferences tag is already exists"};
}
}

async function addUserTag(req) {
  const user=req.user.email;
  const queryData = await req.dbClient.g.V().hasLabel('preferencesTag')
  .has('name',req.body.tagName).as('a').V().hasLabel('User')
  .has('email',user)
  .addE('TAGWITH').to('a').property('createdDate',Date.now()).valueMap(true).toList();
  if(queryData.length >= 1){
    return {"status":1,"data":queryData[0]};
  }else{
    return {"status":0,"data":queryData};
  }
}

module.exports = {
 getPreferencesTagData,addpreferencesTag,addUserTag,getUserTagData
};
