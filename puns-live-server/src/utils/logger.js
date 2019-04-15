const log4js = require('log4js');
const conf = require('../config');

log4js.configure({
    appenders: { puns_server: { type: 'console' }},
    categories: { default: { appenders: ['puns_server'], level: conf.app.logger.level }}
});

module.exports = log4js.getLogger('puns_server');