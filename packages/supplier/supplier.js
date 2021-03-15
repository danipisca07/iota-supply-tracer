'use strict';


const { Operations } = require('@iota-supply-tracer/constants');
const iotaHelper = require('@iota-supply-tracer/iota-helper');
const IotaClient = require('@iota-supply-tracer/iota-client');
const Configuration = require('@iota-supply-tracer/configuration');
const MessageSigner = require('@iota-supply-tracer/message-signer');

class Supplier {
    constructor() {

    }

    async init() {
        return new Promise(async (resolve, reject) => {
            try {
                this.config = await Configuration.loadConfiguration();
                if (this.config.seed === null)
                    this.config.seed = iotaHelper.generateSeed();
                this.client = new IotaClient(this.config.seed);
                if (this.config.privateKey === null)
                    await this.generateNewKey();
            } catch (err) {
                reject(err);
            }
            resolve();
        })
    }

    async newProduct() {
        return new Promise(async (resolve, reject) => {
            if (!this.config)
                reject(new Error("Should call init first!"));
            try {
                let product = {};
                product.seed = iotaHelper.generateSeed();
                product.client = new IotaClient(product.seed);
                product.id = await product.client.generateAddress();
                const payload = {
                    id: product.id,
                    op: Operations.CREATION,
                    entity: this.config.certificate.entity,
                };
                MessageSigner.signPayload(payload, this.config.privateKey);
                product.transactionHash = await product.client.newTransaction(product.id, 0, payload);
                resolve(product);
            }
            catch (err) {
                reject(err);
            }
        })
    }

    /**
     * 
     * @param {*} product 
     * @param {*} newOwnerCertificate Certificate object
     * @returns 
     */
    async transferProduct(product, newEntity) {
        return new Promise(async (resolve, reject) => {
            if (!this.config)
                reject(new Error("Should call init first!"));
            try {
                const payload = {
                    id: product.id,
                    op: Operations.TRANSFER,
                    newEntity: newEntity,
                    entity: this.config.certificate.entity,
                }
                MessageSigner.signPayload(payload, this.config.privateKey);
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
            catch (err) {
                reject(err);
            }
        })
    }

    async transferProductToEndUser(product) {
        return new Promise(async (resolve, reject) => {
            if (!this.config)
                reject(new Error("Should call init first!"));
            const payload = {
                id: product.id,
                op: Operations.TRANSFER_TO_END_USER,
                delivered: true,
                confirmed: false,
                entity: this.config.certificate.entity,
            }
            MessageSigner.signPayload(payload, this.config.privateKey);
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

    async updateProduct(product, status) {
        return new Promise(async (resolve, reject) => {
            if (!this.config)
                reject(new Error("Should call init first!"));
            const payload = {
                id: product.id,
                op: Operations.UPDATE,
                status,
                entity: this.config.certificate.entity,
            }
            MessageSigner.signPayload(payload, this.config.privateKey);
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

    async generateNewKey() {
        return new Promise(async (resolve, reject) => {
            const keypair = await MessageSigner.generateKeyPair();
            const newAddr = await this.client.generateAddress();
            const certificate = {
                name: this.config.name,
                website: this.config.website,
                entity: this.config.certificate?.entity != undefined ? this.config.certificate.entity : newAddr,
                publicKey: keypair.publicKey,
            }
            this.client.newTransaction(newAddr, 0, { certificate })
                .then((hash) => {
                    this.config.privateKey = keypair.privateKey;
                    this.config.certificate = certificate;
                    //TODO: save private key on configuration
                    resolve(hash);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    getCurrentCertificate() {
        return this.config.certificate;
    }


}

module.exports = Supplier;


