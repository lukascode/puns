
var Config = function() {
    switch(process.env.NODE_ENV) {
        case 'development': 
            return {
                app: {
                    port: 4001,
                    logger: {
                        level: 'debug'
                    },
                    mongodb: {
                        dbname: 'puns_live_db',
                        uri: 'mongodb://puns:puns@localhost:27017/puns_live_db'
                    },
                    puns_core: {
                        auth_server_uri: 'http://puns-live-server-client:puns-live-server-client-secret@localhost:8082/puns-auth-api/oauth/token?grant_type=client_credentials',
                        core_server_uri: 'http://localhost:8081/puns-core-api/'
                    },
                    emojis_uri: '/images/',
                    emojis_uri_local: 'http://localhost:4444/node/images/'
                }
            };

        case 'docker':
            return {
                app: {
                    port: 4001,
                    logger: {
                        level: 'debug'
                    },
                    mongodb: {
                        dbname: 'puns_live_db',
                        uri: 'mongodb://puns:puns@mongo:27017/puns_live_db'
                    },
                    puns_core: {
                        auth_server_uri: 'http://puns-live-server-client:puns-live-server-client-secret@auth-server:8082/puns-auth-api/oauth/token?grant_type=client_credentials',
                        core_server_uri: 'http://core-api:8081/puns-core-api/'
                    }
                }
            };
    }
}

module.exports = new Config();