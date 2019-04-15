const mongoUtil = require('../utils/mongoUtil');

const collectionName = 'public_chat';

module.exports = class PublicChat {

    static addMessage(message) {
        return new Promise((resolve, reject) => {
            PublicChat._getCollection().insertOne(message, (err, result) => {
                if(err) throw new Error(err);
                resolve(result);
            })
        });
    }

    static getAllMessagesDesc() {
        return PublicChat._getCollection().find({}).sort({sendingTime: -1}).toArray();
    }

    static getAllMessagesAsc() {
        return PublicChat._getCollection().find({}).sort({sendingTime: 1}).toArray();
    }

    static updatePlayerAvatar(updateRq) {
        return new Promise((resolve, reject) => {
            PublicChat._getCollection().updateMany({ playerId: updateRq.playerId }, 
                { $set: { avatarId: updateRq.newAvatarId}}, (err, result) => {
                    if(err) throw new Error(err);
                    resolve(result);
                });
        });
    }

    static _getCollection() {
        return mongoUtil.getDb().collection(collectionName);
    }

}