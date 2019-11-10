const mongoose = require('mongoose');

const RCSchema = new mongoose.Schema({
    username: String,
    password: String
});

module.exports = mongoose.model('User', RCSchema);