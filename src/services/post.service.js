const gremlin = require('gremlin');
const pushToS3 = require('../helpers/uploadToS3');

const __ = gremlin.process.statics;

async function addPostData(req) {
  try {
  const images = req.files['images'];
  const videos = req.files['videos'];

  const imagesS3 = await Promise.all(
    images.map(async (item, index) => {
        const s3Upload = await pushToS3({
          fileName: item.filename,
          filePath: item.path,
        });
      return s3Upload.upload;
    })
  );
  const videosS3 = await Promise.all(
    videos.map(async (item, index) => {
        const s3Upload = await pushToS3({
          fileName: item.filename,
          filePath: item.path,
        });
      return s3Upload.upload;
    })
  );
 
  const user=req.user.email;
  const postData = req.body;
  const vertexLabel = 'post';  

const properties = {
    userId: req.user.userId,
    descriptions: postData.descriptions,
    images: imagesS3,
    videos:videosS3,
    polls:postData.polls,
    createdDate :postData.createdDate
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
    catch (error) {
          console.error('Error fetching persons:', error);
          res.status(500).send('An error occurred while processing your request.');
        }

}

async function getUserPostData(req) {
 
  const user=req.user.email;
  const queryData = await req.dbClient.g.V()
  .hasLabel('User')
  .has('email', user)
  .as('user')
  .out('post').as('post')
  .select('user', 'post')
  .by(__.valueMap('firstName','lastName','profileImage'))
  .by(__.valueMap(true))
  .toList(); 
    return {"status":1,"data":queryData};
}


module.exports = {
    addPostData,getUserPostData
};
