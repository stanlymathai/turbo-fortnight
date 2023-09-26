const {signUp,verfiryLogin} = require('../services/auth.service');
// This checks the health/status of the application.
const generate_token = require('../helpers/generateToken.helper');
function healthCheck(_, res) {
  // Future: Check database connection or other services.
  res.status(200).send('As Strong as an Ox!');
}

async function signup(req, res) {
  const signupData = req.body;
  
  if (!signupData) {
    return res
      .status(400)
      .send('Missing signup data in request body.');
  }

  try {
    const result = await signUp(req);
            if(result.status){
               const getResultData=JSON.parse(JSON.stringify(result));
              const resultData = {
                user: {
                  userId:getResultData.data.value.id,
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  gender: req.body.gender,
                  email: req.body.email,
                },
                token: generate_token({ email: req.body.email,userId:getResultData.data.value.id }),
              };
              const responseData ={
                "success": true,
                'msg':result.msg,
                "data":resultData
              }
             res.status(201).json(responseData);
            }else{
              const responseData ={
                "success": false,
                'msg':result.msg,
                "data":result.data
              }
             res.status(201).json(responseData);
            }
    
  } catch (error) {
    console.error('Error adding persons and relationship:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
}

async function login(req, res) {
  const payload = req.body;
  try {
  const _doc = await verfiryLogin(req);
      if (_doc) {
        if (_doc[0].password[0] === payload.password) {
          const responseData = {
            user: {
              firstName: _doc[0].firstName[0],
              lastName: _doc[0].lastName[0],
              gender: _doc[0].gender[0],
              email: _doc[0].email[0],
              id: _doc[0].id,
            },
            token: generate_token({ email: _doc[0].email[0],userId:_doc[0].id })
          };
          res.status(200).json(responseData);
        } else {
          res.status(403).json({ message: 'Wrong password' });
        }
      } else {
        res.status(403).json({ message: 'User not found' });
      }
    }
    catch (error) {
      console.error('Error Login:', error);
      res.status(500).send('An error occurred while processing your request.');
    }
}

module.exports = { healthCheck,signup,login };
