'use strict';

const Configuration = {
    provider: 'https://nodes.devnet.thetangle.org:443'
}

const Iota = require('@iota/core');
const iotaHelper = require('@iota-supply-tracer/iota-helper')

class IotaClient {
    constructor(seed) {
        this._iota = Iota.composeAPI({
            provider: Configuration.provider
        });
        if (seed == null)
            seed = iotaHelper.generateSeed();
        this._seed = seed;
    }

    getSeed() {
        return this._seed;
    }

    async generateAddress(securityLevel = 2) {
        return new Promise((resolve, reject) => {
            this._iota.getNewAddress(this._seed, { index: 0, securityLevel: securityLevel, total: 1 })
                .then(address => {
                    resolve(address[0]);
                })
                .catch(err => {
                    reject(err);
                });
        })
    }
}

module.exports = IotaClient;