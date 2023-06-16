const jwt = require('jsonwebtoken')
require('dotenv').config();

function refreshGenerator(id){
    const payload = {
        user: id
    };
    return jwt.sign(payload, process.env.refreshSecret, {expiresIn: "7hr"});

}

module.exports = refreshGenerator;