const gremlin = require('gremlin');
const __ = gremlin.process.statics;

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
        
          const tagDisLike = await Promise.all(
            result[0].tagDisLike.map(async (item, index) => {
                const tagDisLike =  await req.dbClient.g.V().hasLabel('User')
                .has('email',user).property('tagDisLike', item).next();
              return tagDisLike;
            })
          );
            
        }
      
        const queryData = await req.dbClient.g.V().hasLabel('User').has('email',user).valueMap(true).toList();
        return {"status":1,"data":queryData};
        
        }else{
         
          await req.dbClient.g.V().hasLabel('User').has('email',user)
          .property('tagDisLike', '').iterate();
         
          const queryData = await req.dbClient.g.V().hasLabel('User').has('email',user).valueMap(true).toList();
          return {"status":1,"data":queryData};
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
          
        const tagLike = await Promise.all(
          result[0].tagLike.map(async (item, index) => {
              const tagLike =  await req.dbClient.g.V().hasLabel('User')
              .has('email',user).property('tagLike', item).next();
            return tagLike;
          })
        );
           
       
      }
     
      const queryData = await req.dbClient.g.V().hasLabel('User').has('email',user).valueMap(true).toList();
      return {"status":1,"data":queryData};
      
      }else{
      
        await req.dbClient.g.V().hasLabel('User').has('email',user)
        .property('tagLike','').iterate();
        const queryData = await req.dbClient.g.V().hasLabel('User').has('email',user).valueMap(true).toList();
        return {"status":1,"data":queryData};
      }

             
     }else{
      return {"status":0,"data":"","msg":"This preferences not exists"};
     }
  
}else{
  return {"status":0,"data":"","msg":"This preferences tag is already exists"};
}

}

async function deleteUserTagService(req) {
  const user=req.user.email;
  const body=req.body;
  console.log("body",body);
  const TagExists = await req.dbClient.g.V()
  .hasLabel('preferencesTag')
  .has('name',req.body.tagName)
  .hasNext();
  console.log("TagExists",TagExists);
if (TagExists) {
     if(req.body.deletePreferences == 'like'){
      const result = await req.dbClient.g.V().hasLabel('User')
      .has('email',user).valueMap(true).toList();

      if(result[0].tagLike != 'undefined' && result[0].tagLike?.length >= 1){
                        console.log("result[0].tagLike",result[0].tagLike);
        const indexToRemove = result[0].tagLike.indexOf(req.body.tagName);
        if (indexToRemove !== -1) {
          result[0].tagLike.splice(indexToRemove, 1);
          await req.dbClient.g.V().hasLabel('User').has('email',user)
          .properties('tagLike').sideEffect(__.drop()).iterate();
        
          const tagLike = await Promise.all(
            result[0].tagLike.map(async (item, index) => {
                const tagLike =  await req.dbClient.g.V().hasLabel('User')
                .has('email',user).property('tagLike', item).next();
              return tagLike;
            })
          );
            
        }
      
        const queryData = await req.dbClient.g.V().hasLabel('User').has('email',user).valueMap(true).toList();
        return {"status":1,"data":queryData};
        
        }else{
         
          await req.dbClient.g.V().hasLabel('User').has('email',user)
          .property('tagDisLike', '').iterate();
         
          const queryData = await req.dbClient.g.V().hasLabel('User').has('email',user).valueMap(true).toList();
          return {"status":1,"data":queryData};
        }
     }else if(req.body.deletePreferences == 'dislike'){

      const result = await req.dbClient.g.V().hasLabel('User').has('email',user)
      .valueMap(true).toList();
              
      if(result[0].tagDisLike != 'undefined' && result[0].tagDisLike?.length >= 1  ){
                         
      const indexToRemove = result[0].tagDisLike.indexOf(req.body.tagName);
      if (indexToRemove !== -1) {
        result[0].tagDisLike.splice(indexToRemove, 1);
        await req.dbClient.g.V().hasLabel('User').has('email',user)
        .properties('tagDisLike').sideEffect(__.drop()).iterate();
          
        const tagDisLike = await Promise.all(
          result[0].tagDisLike.map(async (item, index) => {
              const tagDisLike =  await req.dbClient.g.V().hasLabel('User')
              .has('email',user).property('tagDisLike', item).next();
            return tagDisLike;
          })
        );
           
       
      }
     
      const queryData = await req.dbClient.g.V().hasLabel('User').has('email',user).valueMap(true).toList();
      return {"status":1,"data":queryData};
      
      }else{
      
        await req.dbClient.g.V().hasLabel('User').has('email',user)
        .property('tagLike','').iterate();
        const queryData = await req.dbClient.g.V().hasLabel('User').has('email',user).valueMap(true).toList();
        return {"status":1,"data":queryData};
      }

             
     }else{
      return {"status":0,"data":"","msg":"This preferences not exists"};
     }
  
}else{
  return {"status":0,"data":"","msg":"This preferences tag is already exists"};
}

}



module.exports = {
 getPreferencesTagData,addpreferencesTag
 ,addUserTag,getUserTagData,deleteUserTagService
};
