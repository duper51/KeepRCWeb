const bcrypt = require("bcrypt");
const MongoConnector = require('./MongoConnector');

function basicAuthorizerAsync(username, password, cb) {
    let inst = MongoConnector.get_instance();
    let con = inst.get_connection();
    let col = con.collection("users");
    col.findOne( { username: username } )
        .then(doc => {
            if(doc !== null) {
                cb(null, bcrypt.compareSync(password, doc.password));
            } else {
                cb(null, false);
            }
        })
        .catch(err => cb(err, false));
}

module.exports = basicAuthorizerAsync;