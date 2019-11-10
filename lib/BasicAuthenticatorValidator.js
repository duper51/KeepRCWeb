const bcrypt = require("bcrypt");
const User = require('./models/User');

function basicAuthorizerAsync(username, password, cb) {
    User.findOne({username: username}, (e, doc) => {
        if(e) {
            cb(e, false);
        } else {
            if (doc !== null) {
                cb(null, bcrypt.compareSync(password, doc.password));
            } else {
                cb(null, false);
            }
        }
    });
}

module.exports = basicAuthorizerAsync;