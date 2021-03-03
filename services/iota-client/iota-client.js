'use strict';

const Configuration = require('@iota-supply-tracer/configuration')
const iotaHelper = require('@iota-supply-tracer/iota-helper');
const { Ed25519Seed, Converter } = require('@iota/iota.js');
const iotajs = require('@iota/iota.js');

class IotaClient {
    constructor(seed) {
        if (seed == null)
            seed = Configuration.seed;
        //this._seed = seed;
        this._seed = new Ed25519Seed(Converter.utf8ToBytes(seed));
    }

    getSeed() {
        return this._seed;
    }

    async generateAddress() {
        return new Promise((resolve, reject) => {
            //iotajs.getUnspentAddress(this._seed)
            iotajs.getUnspentAddress(iotaHelper.api, this._seed)
                .then(address => {
                    resolve(address[0]);
                })
                .catch(err => {
                    reject(err);
                });
        })
    }

    async getAccountData() {
        return new Promise((resolve, reject) => {
            iotaHelper.api.getAccountData(this._seed, { start: 0, security: 2 })
                .then(accountData => {
                    resolve(accountData);
                })
                .catch(err => {
                    reject(err);
                });
        })
    }

    async newTransaction(address, value = 0, message = null) {
        return new Promise(async (resolve, reject) => {
            const depth = 3;
            const minimumWeightMagnitude = 9;
            const messageInTrytes = Converter.asciiToTrytes(JSON.stringify(message));
            const transfers = [
                {
                    value: value, //Value is in iota (i) , to send 1 Mi set to 1000000
                    address: address,
                    message: messageInTrytes
                }
            ];

            iotaHelper.api.prepareTransfers(this._seed, transfers)
                .then(trytes => {
                    return iotaHelper.api.sendTrytes(trytes, depth, minimumWeightMagnitude);
                })
                .then(bundle => {
                    resolve(bundle[0].hash);
                })
                .catch(err => {
                    reject(err);
                });
        })
    }
}

module.exports = IotaClient;