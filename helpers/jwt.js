const { expressjwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET;
  return expressjwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: ["/api/v1/users/login"],              //exclude login path from authorization
  });
}

module.exports = authJwt;
