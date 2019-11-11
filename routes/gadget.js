const express = require('express');
const router = express.Router();
const Gadget = require("../lib/models/Gadget");
const MAX_FILE_SIZE = 4000;
const MAX_FILES = 10;
const BasicAuthenticationValidator = require('../lib/BasicAuthenticatorValidator');
const expressBasic = require('express-basic-auth');
router.use(expressBasic( {
    authorizer: BasicAuthenticationValidator,
    authorizeAsync: true
}));
router.get('/:shortcode', function(req, res, next) {

});

router.post('/:shortcode', function(req, res, next) {
    Gadget.countDocuments({shortcode: req.params.shortcode})
        .then((c) => {
            if(c !== 0) {
                res.status(409).json({error: 409, message: "That gadget shortcode already exists on our server"});
            } else {
                new Gadget({
                    shortcode: req.params.shortcode,
                    content: req.body.content,
                    shell: req.body.shell,
                    rcfile: req.body.rcfile,
                    owner: req.auth.user,
                }).save()
                    .then(() => res.json({}))
                    .catch((e) => {
                        res.status(500).json({error: 500, message: "Unexpected database error"});
                        console.error(e);
                    });
            }
        });
});

module.exports = router;