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
    api : iota,

    generate: (count, characters) => {
        let rnd = '';
        for (let i = 0; i < count; i++) {
            rnd += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return rnd;
    },

    generateSeed: () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
        return iotaHelper.generate(81, characters);
    },

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