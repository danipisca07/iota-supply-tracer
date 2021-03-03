'use strict';
const crypto = require('crypto');

const MessageSigner = {
    /**
     * 
     * @param {String} message 
     * @param {Object} privkey
     * @returns {String} signature 
     */
    sign : (message, privkey) => {
        const sign = crypto.createSign('SHA256');
        sign.update(JSON.stringify(message)).end();

        const signature = sign.sign(privkey);
        return signature;
    },

    verify : (message, signature, pubkey) => {
        const verify = crypto.createVerify('SHA256');
        verify.update(JSON.stringify(message)).end();
        return verify.verify(pubkey, signature);
    }
};

module.exports = MessageSigner;