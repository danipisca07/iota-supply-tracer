'use strict';
require('dotenv').config()

const Configuration = {
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