const MongoClient = require('mongodb').MongoClient;
const conf = require('../config');

var _db;

module.exports = {

    connectToServer: function() {
        return new Promise((resolve, reject) => {
            if(!_db) {
                MongoClient.connect(conf.app.mongodb.uri, { useNewUrlParser: true }, function(err, db) {
                    if(err) throw new Error('Mongodb connection error', err);
                    _db = db.db(conf.app.mongodb.dbname);
                    resolve(_db);
                });
            } else {
                resolve(_db);
            }
        });
    },

    getDb: function() {
        return _db;
    }

};