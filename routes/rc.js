const express = require('express');
const router = express.Router();
const RCFile = require("../lib/models/RCFile");
const BasicAuthenticationValidator = require('../lib/BasicAuthenticatorValidator');
const MAX_FILE_SIZE = 40000;
const MAX_FILES = 10;
const expressBasic = require('express-basic-auth');
router.use(expressBasic( {
    authorizer: BasicAuthenticationValidator,
    authorizeAsync: true
}));

/* GET rc listing. */
router.get('/:filename', function(req, res, next) {
    RCFile.findOne({name: req.params.filename}, (err, doc) => {
        if(err) {
            next(err);
        } else {
            if(doc === null) {
                res.status(404).json({error: 404, message: "Not found"});
            } else {
                if(doc.owner.toLocaleUpperCase() === req.auth.user.toLocaleUpperCase()) {
                    res.json(doc);
                } else {
                    res.status(401).json( { error: 401, message: "Not authorized to access this user's RC file" } );
                }
            }
        }
    });
});

router.post('/:filename', function(req, res, next) {
    RCFile.findOne({ name: req.params.filename, account: req.params.account })
        .then((doc => {
            if(doc !== null) {
                res.status(409).json({error: 409, message: "The file already exists on our server"});
            } else if(req.params.filename && req.body.content && req.body.name) {
                RCFile.countDocuments({owner: req.auth.user}).then((count => {
                    if(req.body.content.length > MAX_FILE_SIZE) {
                        res.status(413).json({error: 413, message: "Filesize is larger than allowed (" + MAX_FILE_SIZE + " chars)"})
                    } else if(count >= MAX_FILES) {
                        res.status(500).json({error: 500, message: "This file would exceed your maximum allowed files for your account"});
                    } else {
                        new RCFile({
                            name: req.params.filename,
                            filename: req.body.name,
                            content: req.body.content,
                            owner: req.auth.user
                        }).save()
                            .then(() => res.json({}))
                            .catch((e) => {
                                res.status(500).json({"error": 500, "message": "Unexpected error from database"});
                                console.error(e);
                            });
                    }
                }));
            } else {
                res.status(400).json({error: 400, message: "Missing filename parameter"});
            }
        }))
        .catch(err => {
            res.status(500).json({error: 500, message: "Unexpected error from database"});
            console.error(err);
        });
});

router.put('/:filename', function(req, res, next) {
    RCFile.findOne({name: req.params.filename}, (err, doc) => {
        if(err) {
            next(err);
        } else {
            if(doc === null) {
                res.status(404).json({error: 404, message: "Not found"});
            } else {
                if(req.body.content.length > MAX_FILE_SIZE) {
                    res.status(413).json({
                        error: 413,
                        message: "Filesize is larger than allowed (" + MAX_FILE_SIZE + " chars)"
                    })
                } else if(doc.owner.toLocaleUpperCase() === req.auth.user.toLocaleUpperCase()) {
                    doc.content = req.body.content;
                    doc.save()
                        .then(() => {
                            res.json({});
                        })
                        .catch((e) => {
                            res.status(500).json({error: 500, message: "Unexpected error from database"});
                            console.error(e);
                        });
                } else {
                    res.status(401).json( { error: 401, message: "Not authorized to modify this user's RC file" } );
                }
            }
        }
    });
});

router.delete('/:filename', (req, res, next) => {
    RCFile.findOne({name: req.params.filename}, (err, doc) => {
        if(err) {
            next(err);
        } else {
            if(doc === null) {
                res.status(404).json({error: 404, message: "Not found"});
            } else {
                if(doc.owner.toLocaleUpperCase() === req.auth.user.toLocaleUpperCase()) {
                    doc.delete()
                        .then(() => res.json({}))
                        .catch((e) => {
                            res.status(500).json({error: 500, message: "Unexpected database error"})
                            console.error(e);
                        });
                } else {
                    res.status(401).json( { error: 401, message: "Not authorized to access this user's RC file" } );
                }
            }
        }
    });
});

module.exports = router;
