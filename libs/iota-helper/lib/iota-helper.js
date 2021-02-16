'use strict';
const Iota = require('@iota/core');
const Extract = require('@iota/extract-json');

const Configuration = {
    provider: 'https://nodes.devnet.iota.org:443'
}

const iota = Iota.composeAPI({
    provider: Configuration.provider
});

const iotaHelper = {
    generateSeed: () => {
        var seed = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
        for (var i = 0; i < 81; i++) {
            seed += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return seed;
    },

    api : iota,

    checkBalance: async (address) => {
        return new Promise((resolve, reject) => {
            iotaHelper.api.getBalances([address])
                .then(({ balances }) => {
                    resolve(balances) //ex: [ 1 ]
                })
                .catch(err => {
                    reject(err)
                })
        })
    },

    readTransaction: async (hash) => {
        return new Promise((resolve, reject) => {
            iotaHelper.api.getBundle(hash)
                .then(bundle => {
                    const message = JSON.parse(Extract.extractJson(bundle));
                    resolve({
                        address: bundle[0].address,
                        timestamp : bundle[0].timestamp,
                        message: message,
                        bundle: bundle,
                    })
                })
                .catch(err => {
                    reject(err);
                });
        })
    },

    verifyTransaction: async (hash) => {
        return new Promise((resolve,reject) => {
            iotaHelper.api.getInclusionStates([hash])
                .then(states => resolve(states[0]));
        })
    }
}

module.exports = iotaHelper;
