'use strict';

const { config } = require('dotenv');

require('dotenv').config()

const Configuration = {
    loadConfiguration : async (path) => {
        return new Promise ((resolve, reject) => {
            //TODO
            const config = {
                name : null,
                website: null,
                certificate : {},
                seed : null,
                privateKey: null,
            };
            resolve(config);
        })
    },

    get : (param) => {
        if(this.config === null){
            throw new Error("Configuration not loaded, call loadConfiguration first");
        }
        else
            return this.config[param];
    },

}

module.exports = Configuration;