const gremlin = require('gremlin');
const {  P } = gremlin.process;
const __ = gremlin.process.statics;



async function addPeerRequest(req) {
  const user=req.user.email;
  const queryData = await req.dbClient.g.V().
  hasLabel('User').has('email',req.body.peersEmailId).as('a')
  .V().hasLabel('User').has('email',user)
  .addE('FRIEND').to('a').property('createdDate',Date.now())
  .property('status','false')
  .valueMap(true,'residency','lastName','profileDescription','id','dateOfBirth','profileImage','tagDisLike'
  ,'firstName','bannerImage','tagLike','gender','email').toList();
  if(queryData.length >= 1){
    return {"status":1,"data":queryData[0]};
  }else{
    return {"status":0,"data":queryData};
  }
}

async function addRelationship(req) {
  const user=req.user.email;
  const queryData = await req.dbClient.g.V().
  hasLabel('User').has('email',req.body.peersEmailId).as('a')
  .V().hasLabel('User').has('email',user)
  .addE('FRIEND').to('a').property('createdDate',Date.now()).valueMap(true,'residency','lastName','profileDescription','id','dateOfBirth','profileImage','tagDisLike'
  ,'firstName','bannerImage','tagLike','gender','email').toList();
  if(queryData.length >= 1){
    return {"status":1,"data":queryData[0]};
  }else{
    return {"status":0,"data":queryData};
  }
}


async function userPeersList(req) {
  const user=req.user.email;
  
  const queryData = await req.dbClient.g.V().hasLabel('User')
  .has('email',user).as('user').  
  both('FRIEND').aggregate('friends').  
  V().hasLabel('User').
    where(P.neq('user')).where(P.without('friends'))  
  .valueMap(true,'residency','lastName','profileDescription','id','dateOfBirth','profileImage','tagDisLike'
  ,'firstName','bannerImage','tagLike','gender','email').toList();
  if(queryData.length >= 1){
    return {"status":1,"data":queryData};
  }else{
    return {"status":0,"data":queryData};
  }
}

async function peersContactList(req) {
  const user=req.user.email;
  const queryData = await req.dbClient.g.V().hasLabel('User')
  .has('email',user)
  .out('FRIEND')
  .valueMap(true,'residency','lastName','profileDescription','id','dateOfBirth','profileImage','tagDisLike'
  ,'firstName','bannerImage','tagLike','gender','email').toList();  
  if(queryData.length >= 1){
    return {"status":1,"data":queryData};
  }else{
    return {"status":0,"data":queryData};
  }              
}

async function UserRequestList(req) {
  const user=req.user.email;
  const queryData = await req.dbClient.g.V().hasLabel('User')
  .has('email',user)
  .outE('FRIEND')
  .has('status','false')
  .inV()
  .valueMap(true,'residency','lastName','profileDescription','id','dateOfBirth','profileImage','tagDisLike'
  ,'firstName','bannerImage','tagLike','gender','email').toList();  
  if(queryData.length >= 1){
    return {"status":1,"data":queryData};
  }else{
    return {"status":0,"data":queryData};
  }              
}


async function searchPeers(req) {
  const user=req.user.email;
  console.log("user",user);
  console.log("req.body.searchItem",req.body.searchItem);
  const queryData = await req.dbClient.g.V()
  .hasLabel('User')   // Replace with your vertex label
  .has('firstName',P.within(req.body.searchItem))
  .valueMap(true,'residency','lastName','profileDescription','id','dateOfBirth','profileImage','tagDisLike'
   ,'firstName','bannerImage','tagLike','gender','email').toList();

  if(queryData.length >= 1){
    return {"status":1,"data":queryData};
  }else{
    return {"status":0,"data":queryData};
  }              
}


module.exports = {
  addRelationship,searchPeers,UserRequestList
  ,userPeersList,peersContactList,addPeerRequest
};
