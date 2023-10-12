const { v4: uuidv4 } = require('uuid');
const defaut =require('../utils/defaultValue.util');
async function signUp(req) {
  const signupData = req.body;

  const personVertex = await req.dbClient.g.V().hasLabel('User').hasNext();

 if (!personVertex) {
  await req.dbClient.g.addV().label('User')
  } 

  const personExists = await req.dbClient.g.V()
  .hasLabel('User')
  .has('email', signupData.email)
  .hasNext();

if (!personExists) {
  const queryData= await req.dbClient.g.addV('User')
  .property('firstName', signupData.firstName)
  .property('lastName', signupData.lastName)
  .property('gender', signupData.gender)
  .property('password', signupData.password)
  .property('email', signupData.email)
  .property('dateOfBirth', signupData.dateOfBirth)
  .property('residency', signupData.residency)
  .property('bannerImage', defaut.IMAGE_PATH.PROFILE_BANNER_IMAGE)
  .property('profileImage', defaut.IMAGE_PATH.PROFILE_IMAGE)
  .property('secretOrKey', uuidv4())
  .property('status', 'ACTIVE')
  .property('profileDescription', signupData.profileDescription).next();

  const getsignUpData = await req.dbClient.g.V().hasLabel('User')
  .has('email',signupData.email).valueMap(true).toList(); 

        return {"status":1,"data":getsignUpData,"msg":"successfully registered"};
} else {
  return {"status":0,"data":"","msg":"This email id is already exists"};
}
}
async function verfiryLogin(req) {
  return await req.dbClient.g.V().hasLabel('User')
  .has('email', req.body.email).valueMap(true).toList();
}

module.exports = {
 signUp,verfiryLogin
};
