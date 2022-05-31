const expressjwt = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET;
  const api = process.env.URL_VERSION;
  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      `${api}/users/login`, //exclude login path from authorization
      `${api}/users/register`,
      { url: /\/api\/v1\/products(.*)/, method: ["GET", "OPTIONS"] }, //exclude all get methods after /api/v1/products/...   from authorization
      { url: /\/api\/v1\/categories(.*)/, method: ["GET", "OPTIONS"] },
    ],
  });
}

const isRevoked = async (req, payload, done) => {   //rovoke apis that are not from admins (can't do DELETE POST PUT)
  if (!payload.isAdmin) {
   return done(null, true)
  }
  return done()

};

module.exports = authJwt;
