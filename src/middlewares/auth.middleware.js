const jwt = require('jsonwebtoken');
const { app_key } = require('../configs/env/app.env');


async function verifyJwt(req, res) {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is required' });
    }
    jwt.verify(token, app_key, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

async function verify_token(req, res, next) {
 
  try {
    const decodedToken = await verifyJwt(req, res);
     const getUserdata = await req.dbClient.g.V().hasLabel('User')
     .has('secretOrKey',decodedToken.secretOrKey).valueMap(true,'email').toList();
     if (getUserdata.length == 0) {
      return res.status(401).json({ message: 'Invalid user' });
    }
      req.user= { email : getUserdata[0].email[0],
                  userId : getUserdata[0].id
                 }
    next();
    
  } catch (error) {
    return res.status(401).json({ message: 'Token is required' });
  }

}

module.exports = verify_token;