const gremlin = require('gremlin');
const t = gremlin.process.t
const __ = gremlin.process.statics;
const P = gremlin.process.P

async function getPreferencesTagData(req) {
  const queryData= await req.dbClient.g.V().hasLabel('preferencesTag')
  .valueMap(true).toList();
  if(queryData.length >= 1){
    return {"status":1,"data":queryData};
  }else{
    return {"status":0,"data":queryData};
  }
}

async function getUserTagData(req) {
  const { preferences } = req.query;
  const user=req.user.email;
  const queryData = await req.dbClient.g.V().hasLabel('User')
  .has('email',user)
  .out(preferences)
  .valueMap(true).toList(); 
    return {"status":1,"data":queryData};
}


async function addpreferencesTag(req) {
  const preferencesTag = req.body;

  const preferencesVertex = await req.dbClient.g.V().
  hasLabel('preferencesTag').hasNext();

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

async function addUserDisLikeTag(req,disLikeArr,user) {
  console.log("disLikeArr",disLikeArr);
  return disLikeArr.forEach( async function (req,item, index) {
    await req.dbClient.g.V().hasLabel('User').has('email',user)
    .property('tagDisLike', item).next();
  });
   
}

async function addUserLikeTag(req,likeArr,user) {
   console.log("likeArr",likeArr);
  return likeArr.forEach( async function (req,item, index) {
    await req.dbClient.g.V().hasLabel('User').has('email',user)
    .property('tagLike', item).next();
  });
   
}

async function addUserTag(req) {
  const user=req.user.email;
  const body=req.body;

  const TagExists = await req.dbClient.g.V()
  .hasLabel('preferencesTag')
  .has('name',req.body.tagName)
  .hasNext();
        
if (TagExists) {
     if(req.body.preferences == 'like'){
      const result = await req.dbClient.g.V().hasLabel('User').has('email',user).fold().
      coalesce(__.unfold().property('tagLike',req.body.tagName),__.addV('User')
      .has('email',user).property('tagLike',req.body.tagName)).valueMap(true).toList();

      if(result[0].tagDisLike != 'undefined' && result[0].tagDisLike?.length >= 1){
                         
        const indexToRemove = result[0].tagDisLike.indexOf(req.body.tagName);
        if (indexToRemove !== -1) {
          result[0].tagDisLike.splice(indexToRemove, 1);
          await req.dbClient.g.V().hasLabel('User').has('email',user)
          .properties('tagDisLike').sideEffect(__.drop()).iterate();

          await addUserDisLikeTag(req,result[0].tagDisLike,user);
       
        
        }
      
        const queryData = await req.dbClient.g.V().hasLabel('User').has('email',user).valueMap(true).toList();
        return {"status":0,"data":queryData};
        
        }else{
         
          await req.dbClient.g.V().hasLabel('User').has('email',user)
          .property('tagDisLike', '').iterate();
         
          const queryData = await req.dbClient.g.V().hasLabel('User').has('email',user).valueMap(true).toList();
          return {"status":0,"data":queryData};
        }
     }else if(req.body.preferences == 'dislike'){

      const result = await req.dbClient.g.V().hasLabel('User').has('email',user).fold().
      coalesce(__.unfold().property('tagDisLike',req.body.tagName),__.addV('User')
      .has('email',user).property('tagDisLike',req.body.tagName)).valueMap(true).toList();
              
      if(result[0].tagLike != 'undefined' && result[0].tagLike?.length >= 1  ){
                         
      const indexToRemove = result[0].tagLike.indexOf(req.body.tagName);
      if (indexToRemove !== -1) {
        result[0].tagLike.splice(indexToRemove, 1);
        await req.dbClient.g.V().hasLabel('User').has('email',user)
        .properties('tagLike').sideEffect(__.drop()).iterate();
          
        await addUserLikeTag(req,result[0].tagLike,user)
       
      }
     
      const queryData = await req.dbClient.g.V().hasLabel('User').has('email',user).valueMap(true).toList();
      return {"status":0,"data":queryData};
      
      }else{
        console.log("default tagLike set");
        await req.dbClient.g.V().hasLabel('User').has('email',user)
        .property('tagLike','').iterate();
        const queryData = await req.dbClient.g.V().hasLabel('User').has('email',user).valueMap(true).toList();
        return {"status":0,"data":queryData};
      }

             
     }else{
      return {"status":0,"data":"","msg":"This preferences not exists"};
     }
  
}else{
  return {"status":0,"data":"","msg":"This preferences tag is already exists"};
}





  // const user=req.user.email;
  // const body=req.body;
  // const queryData = await req.dbClient.g.V().hasLabel('preferencesTag')
  // .has('name',req.body.tagName).as('a').V().hasLabel('User')
  // .has('email',user)
  // .addE(body.preferences).to('a').property('createdDate',Date.now())
  // .valueMap(true).toList();

  // if(queryData.length >= 1){
  //   return {"status":1,"data":queryData[0]};
  // }else{
  //   return {"status":0,"data":queryData};
  // }
}

module.exports = {
 getPreferencesTagData,addpreferencesTag,addUserTag,getUserTagData
};
