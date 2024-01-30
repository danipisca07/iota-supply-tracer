'use strict';

const IotaClient = require('@iota-supply-tracer/iota-client');
const Configuration = require('@iota-supply-tracer/configuration');

class Supplier {
    constructor() {
        this.client = new IotaClient()
        this.certificate = Configuration.certificate;
        this.authenticator = Configuration.authenticator;
    }

    async newProduct() {
        let product = {};
        product.seed = IotaClient.generateSeed();
        product.client = new IotaClient(product.seed);
        product.address = await product.client.generateAddress();
        product.id = await this.client.generateAddress(); //TODO: receive Id as param?
        const payload = {
            id: product.id,
            certificate: this.certificate,
            signature: this.authenticator.sign(product.id),
        };
        product.transactionHash = await this.client.newTransaction(product.address, 0, payload)
        return product
    }

    async transferProduct(product, newOwnerCertificate){
        const payload = {
            id: product.id,
            newOwnerCertificate,
            certificate: this.certificate,
            signature: this.authenticator.sign(product.id),
        };
        const productClient = new IotaClient(product.seed);
        const newAddr = await productClient.generateAddress();
        const hash = await this.client.newTransaction(newAddr, 0, payload);
        return hash;
    }

    async transferProductToEndUser(product){
        const payload = {
            id: product.id,
            delivered: true,
            confirmed: false,
            certificate: this.certificate,
            signature: this.authenticator.sign(product.id),
        };
        const productClient = new IotaClient(product.seed);
        const newAddr = await productClient.generateAddress();
        const hash = await this.client.newTransaction(newAddr, 0, payload);
        return hash;
    }

    async updateProduct(product, status){
        const payload = {
            id: product.id,
            status,
            certificate: this.certificate,
            signature: this.authenticator.sign(product.id),
        };
        const productClient = new IotaClient(product.seed);
        const newAddr = await productClient.generateAddress();
        const hash = await this.client.newTransaction(newAddr, 0, payload);
        return hash;
    }

    
}

module.exports = Supplier;


