'use strict';

const iotaHelper = require('@iota-supply-tracer/iota-helper');
const IotaClient = require('@iota-supply-tracer/iota-client');
const Configuration = require('@iota-supply-tracer/configuration');
const MessageSigner = require('@iota-supply-tracer/message-signer');

class Supplier {
    constructor() {
        this.client = new IotaClient();
        //TODO: read keypair from config (if any)
        this.generateNewKey();
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
            };
            await this.newKeyPromise;
            payload.signature = MessageSigner.sign(JSON.stringify(payload), this._privateKey);
            product.client.newTransaction(product.address, 0, payload)
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
                }
                await this.newKeyPromise;
                payload.signature = MessageSigner.sign(JSON.stringify(payload), this._privateKey);
                const productClient = new IotaClient(product.seed);
                const newAddr = await productClient.generateAddress();
                productClient.newTransaction(newAddr, 0, payload)
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
            }
            await this.newKeyPromise;
            payload.signature = MessageSigner.sign(JSON.stringify(payload), this._privateKey);
            const productClient = new IotaClient(product.seed);
            const newAddr = await productClient.generateAddress();
            productClient.newTransaction(newAddr, 0, payload)
                .then((hash) => {
                    resolve(hash);
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }

    async updateProduct(product, status){
        return new Promise(async (resolve, reject) => {
            const payload = {
                id: product.id,
                status
            }
            await this.newKeyPromise;
            payload.signature = MessageSigner.sign(JSON.stringify(payload), this._privateKey);
            const productClient = new IotaClient(product.seed);
            const newAddr = await productClient.generateAddress();
            productClient.newTransaction(newAddr, 0, payload)
                .then((hash) => {
                    resolve(hash);
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }

    async generateNewKey(){
        this.newKeyPromise = new Promise(async (resolve, reject) => {
            const keypair = await MessageSigner.generateKeyPair();
            this._privateKey = keypair.privateKey;
            this._publicKey = keypair.publicKey;
            const payload = {
                name: Configuration.name,
                pubKey: this._publicKey
            }
            const newAddr = await this.client.generateAddress();
            this.client.newTransaction(newAddr, 0, payload)
                .then((hash) => {
                    resolve(hash);
                    //TODO: save private key on configuration
                })
                .catch((err) => {
                    reject(err);
                })
        });
        return this.newKeyPromise;
    }

    
}

module.exports = Supplier;


