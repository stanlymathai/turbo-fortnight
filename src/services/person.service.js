const gremlin = require('gremlin');
const pushToS3 = require('../helpers/uploadToS3');
const defaut =require('../utils/defaultValue.util');
const __ = gremlin.process.statics;


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
  .has('email', user).valueMap(true,'residency','lastName','profileDescription','id','dateOfBirth','profileImage','tagDisLike'
  ,'firstName','bannerImage','tagLike','gender','email').toList();
  if(queryData.length >= 1){
    return {"status":1,"data":queryData[0]};
  }else{
    return {"status":0,"data":queryData};
  }
}


async function profileUpdate(req) {
  const getData = req.body;
  const user=req.user.email;
  const profileImages = req.files['profileImages'];
  const bannerImages = req.files['bannerImages'];
     const profileImagesS3 = await Promise.all(
      profileImages.map(async (item, index) => {
          const s3Upload = await pushToS3({
            fileName: item.filename,
            filePath: item.path,
          });
        return s3Upload.upload;
      })
    );
    const bannerImagesS3 = await Promise.all(
      bannerImages.map(async (item, index) => {
          const s3Upload = await pushToS3({
            fileName: item.filename,
            filePath: item.path,
          });
        return s3Upload.upload;
      })
    );
          const updatedArr={}
          if(getData.profileDescription != undefined && getData.profileDescription.trim().length !== 0){
            updatedArr.profileDescription = getData.profileDescription;
          }
          if(profileImages.length >=1){
            updatedArr.profileImage = profileImagesS3[0];
          }else if(getData.profileImagesDeleted == true ||getData.profileImagesDeleted == 'true'){
            updatedArr.profileImage = defaut.IMAGE_PATH.PROFILE_IMAGE;
          }
          if(bannerImages.length >=1){
            updatedArr.bannerImage = bannerImagesS3[0];
          }else if(getData.bannerImageDeleted == true || getData.bannerImageDeleted == 'true'){
            updatedArr.bannerImage = defaut.IMAGE_PATH.PROFILE_BANNER_IMAGE;
          }

         await Promise.all(
          Object.entries(updatedArr).map(async ([key, value]) => {
            // console.log(`${key}: ${value}`);
             return await req.dbClient.g.V().hasLabel('User').has('email',user)
              .properties(key)
               .sideEffect(__.drop()).iterate();
          }) 
          );
          await Promise.all(
            Object.entries(updatedArr).map(async ([key, value]) => {
              // console.log(`${key}: ${value}`);
               return await req.dbClient.g.V().hasLabel('User').has('email',user)
               .property(key,value).next();
            }) 
            );
         const queryData =  await req.dbClient.g.V()
         .hasLabel('User').has('email',user)
         .valueMap('profileDescription','profileImage','bannerImage').toList();
    
        if(queryData.length >= 1){
          return {"status":1,"data":queryData};
        }else{
          return {"status":0,"data":queryData};
        }
  
}

module.exports = {
  addPersonVertex,
  addRelationship,
  getAllPersons,getProfileData,profileUpdate
};
