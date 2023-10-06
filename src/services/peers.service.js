const gremlin = require('gremlin');
const {  P } = gremlin.process;


async function addRelationship(req) {
  const user=req.user.email;
  const queryData = await req.dbClient.g.V().
  hasLabel('User').has('email',req.body.peersEmailId).as('a')
  .V().hasLabel('User').has('email',user)
  .addE('FRIEND').to('a').property('createdDate',Date.now()).valueMap(true,'residency','lastName','profileDescription','id','dateOfBirth','profileImage','tagDisLike'
  ,'firstName','bannerImage','tagLike','profileImages','gender','email').toList();
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
  ,'firstName','bannerImage','tagLike','profileImages','gender','email').toList();
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
  ,'firstName','bannerImage','tagLike','profileImages','gender','email').toList();  
  if(queryData.length >= 1){
    return {"status":1,"data":queryData};
  }else{
    return {"status":0,"data":queryData};
  }              
}


module.exports = {
  addRelationship
  ,userPeersList,peersContactList
};
