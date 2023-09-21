const gremlin = require('gremlin');
const P = gremlin.process.P;

async function addRelationship(req) {
  return await req.dbClient.g.V().hasLabel('User').has('email',req.body.peersEmailId).as('a').V().hasLabel('User').has('email',req.body.personEmailId).addE('FRIEND').to('a').next();
}


async function userPeersList(req) {
return await req.dbClient.g.V().hasLabel('User').has('email',req.body.email).as('user').  
  both('FRIEND').aggregate('friends').  
  both('FRIEND').
    where(P.neq('user')).where(P.without('friends'))  
  .valueMap(true).toList()

}

async function peersContactList(req) {
  return await req.dbClient.g.V().hasLabel('User')
  .has('email',req.body.email)
  .out('FRIEND')
  .valueMap(true).toList();                
}


module.exports = {
  addRelationship
  ,userPeersList,peersContactList
};
