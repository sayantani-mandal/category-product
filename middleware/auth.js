const { apiKey } = require('./private');

//const config = require('config');
console.log(apiKey);

function auth(req,res,next){
const token = req.header('token');

if(token == apiKey){
    next();
}
else if(!token) return res.status(401).send({Error:'access denied. no apiKey provided'});
else res.status(401).send({Error:'wrong apiKey provided'});

}

module.exports = auth;