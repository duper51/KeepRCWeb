const mongoose = require('mongoose');

const RCSchema = new mongoose.Schema({
    shortcode: String,
    content: String,
    shell: String,
    rcfile: String,
    owner: String,
});

module.exports = mongoose.model('Gadget', RCSchema);