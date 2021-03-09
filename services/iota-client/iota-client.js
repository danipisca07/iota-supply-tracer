'use strict';

const Converter = require('@iota/converter');
const iotaHelper = require('@iota-supply-tracer/iota-helper')

class IotaClient {
    constructor(seed) {
        this._seed = seed;
    }

    getSeed() {
        return this._seed;
    }

    async generateAddress(securityLevel = 2) {
        return new Promise((resolve, reject) => {
            iotaHelper.api.getNewAddress(this._seed, { index: 0, securityLevel: securityLevel})
                .then(address => {
                    resolve(address);
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

    async getAllMessages() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.getAccountData();
                const bundles = await iotaHelper.api.getBundlesFromAddresses(data.addresses);
                const messages = bundles.map(b => iotaHelper.extractMessageFromBundle(b));
                resolve(messages);
            }catch (err){
                reject(err);
            }
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