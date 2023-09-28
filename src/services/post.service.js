const gremlin = require('gremlin');
const __ = gremlin.process.statics;

async function addPostData(req) {
  const user=req.user.email;
  const postData = req.body;
  const vertexLabel = 'post';  

const properties = {
    userId: req.user.userId,
    discriptions: postData.discriptions,
    images: postData.images,
    videos:postData.videos
};

 const newVertex = await req.dbClient.g.addV(vertexLabel);
for (const [key, value] of Object.entries(properties)) {
  if (Array.isArray(value)) {
    for (const val of value) {
      await newVertex.property(key, val);
    }
  } else {
    await newVertex.property(key, value);
  }
}

// Retrieve the vertex and its ID
const result = await newVertex.next();
const vertexId = result.value.id.toString();

await req.dbClient.g.V().
  hasLabel('User').has('email',user).
  addE('post')
  .to(result.value)
  .property('createdDate',Date.now())
  .iterate();
  
  const getpostData = await req.dbClient.g.V(vertexId).valueMap(true).toList();  

  if(getpostData.length >= 1){
          return {"status":1,"data":getpostData[0]};
        }else{
          return {"status":0,"data":getpostData};
        }


}



module.exports = {
    addPostData
};
