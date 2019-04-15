const request = require('request');
const conf = require('../config');
const logger = require('../utils/logger');

var token;

module.exports = class PunsCore {

    static authenticate() {
        return new Promise((resolve, reject) => {
            request.post(conf.app.puns_core.auth_server_uri, (err, response, body) => {
                if (!err && response.statusCode == 200) {
                    const at = JSON.parse(body).access_token;
                    if (at) {
                        token = at;
                        resolve(token);
                        return;
                    }
                } 
                throw new Error('PunsCore authenticate error', err);
            });
        });    
    }

    static getRandomWord() {
        return new Promise((resolve, reject) => {
            request.get({
                url: `${conf.app.puns_core.core_server_uri}words/random`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }, (err, response, body) => {
                if (err) throw new Error(err);
                resolve(body);
            });
        });
    }

    static addScoreForPlayer(addScoreRequest) {
        return new Promise((resolve, reject) => {
            request.post({
                url: `${conf.app.puns_core.core_server_uri}scores/add-score`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: addScoreRequest,
                json: true
            }, (err, response, body) => {
                if (err) throw new Error(err);
                resolve(body);
            });
        });
    }

}