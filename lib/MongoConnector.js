const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

class MongoConnector {
    static singleton;
    constructor() {
        let config = require("../config");
        this._client = new MongoClient(config.mongo.url, { useNewUrlParser: true });
        this._db = null;
        this._client.connect(function (err) {
            assert.equal(err, null);
            console.log("Connection established to MongoDB");
            this._db = this._client.db(config.mongo.db);
        }.bind(this));
    }

    /**
     * @return {Db} null if connection not ready, connection if available
     */
    get_connection() {
        return this._db;
    }

    /**
     * @return {MongoConnector}
     */
    static get_instance() {
        if(MongoConnector.singleton !== undefined) {
            return MongoConnector.singleton;
        } else {
            MongoConnector.singleton = new MongoConnector();
            return MongoConnector.singleton;
        }
    }
}

module.exports = MongoConnector;