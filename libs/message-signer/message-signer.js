'use strict';
const crypto = require('crypto');

const MessageSigner = {
    /**
     * 
     * @param {String} message 
     * @param {Object} privkey
     * @returns {String} signature 
     */
    sign: (message, privkey) => {
        const sign = crypto.createSign('SHA256');
        sign.update(message).end();

        const signature = sign.sign(privkey);
        return signature;
    },

    verify: (message, signature, pubkey) => {
        const verify = crypto.createVerify('SHA256');
        verify.update(message).end();
        return verify.verify(pubkey, signature);
    },

    generateKeyPair: async () => {
        return new Promise((resolve, reject) => {
            crypto.generateKeyPair('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: { type: 'spki', format: 'pem' },
                privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
            }, (err, publicKey, privateKey) => {
                if(err) reject(err);
                else resolve({publicKey, privateKey});
            })
        })
    }
};

module.exports = MessageSigner;