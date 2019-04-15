db = db.getSiblingDB('puns_live_db');

print(db);

db.createUser({
    user: "puns",
    pwd: "puns",
    roles: [{
        role: 'dbOwner',
        db: 'puns_live_db'
    }]
});

db.createCollection("public_chat");

