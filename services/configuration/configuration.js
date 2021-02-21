'use strict';
require('dotenv').config()

const Configuration = {

    provider: 'http://api.lb-0.testnet.chrysalis2.com',

    seed: process.env.SEED,

    certificate: { //TODO: implement certificates
        subject: "not implemented",
        issuer: "not implemented",
        pubkey: "not implemented"
    },

    authenticator: { //TODO: implement encryptor
        sign: (message) => {
            return message;
        }
    }

}

module.exports = Configuration;