const mongoose = require('mongoose');

const RCSchema = new mongoose.Schema({
    filename: String,
    name: String,
    content: String,
    owner: String
});

module.exports = mongoose.model('RCFile', RCSchema);