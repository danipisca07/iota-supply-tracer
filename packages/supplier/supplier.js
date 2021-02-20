'use strict';

const iotaHelper = require('@iota-supply-tracer/iota-helper');
const IotaClient = require('@iota-supply-tracer/iota-client');
const Configuration = require('@iota-supply-tracer/configuration');

class Supplier {
    constructor() {
        this.client = new IotaClient()
        this.certificate = Configuration.certificate;
        this.authenticator = Configuration.authenticator;
    }

    async newProduct() {
        return new Promise(async (resolve, reject) => {
            let product = {};
            product.seed = iotaHelper.generateSeed();
            product.client = new IotaClient(product.seed);
            product.address = await product.client.generateAddress();
            product.id = await this.client.generateAddress(); //TODO: receive Id as param?
            const payload = {
                id: product.id,
                certificate: this.certificate,
                signature: this.authenticator.sign(product.id),
            };
            this.client.newTransaction(product.address, 0, payload)
                .then((hash) => {
                    product.transactionHash = hash;
                    resolve(product)
                })
                .catch((err) => reject(err))
        })
    }

    async transferProduct(product, newOwnerCertificate){
        return new Promise(async (resolve, reject) => {
            try {
                const payload = {
                    id: product.id,
                    newOwnerCertificate,
                    certificate: this.certificate,
                    signature: this.authenticator.sign(product.id),
                }
                const productClient = new IotaClient(product.seed);
                const newAddr = await productClient.generateAddress();
                const hash = this.client.newTransaction(newAddr, 0, payload)
                    .then((hash) => {
                        resolve(hash);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            }   
            catch(err){
                reject(err);
            }
        })
    }

    async transferProductToEndUser(product){
        return new Promise(async (resolve, reject) => {
            const payload = {
                id: product.id,
                delivered: true,
                confirmed: false,
                certificate: this.certificate,
                signature: this.authenticator.sign(product.id),
            }
            const productClient = new IotaClient(product.seed);
            const newAddr = await productClient.generateAddress();
            this.client.newTransaction(newAddr, 0, payload)
                .then((hash) => {
                    resolve(hash);
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }
}

module.exports = Supplier;


