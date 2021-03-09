'use strict';

const IotaClient = require('@iota-supply-tracer/iota-client');
const iotaHelper = require('@iota-supply-tracer/iota-helper');
const MessageSigner = require('@iota-supply-tracer/message-signer');
const { Operations } = require('@iota-supply-tracer/constants');

class User {
    constructor() {
        
    }

    async getSupplyChain(product){
        return new Promise(async (resolve, reject) => {
            try {
                const client = new IotaClient(product.seed);
                const messages = await client.getAllMessages();
                resolve(messages);
            }catch(e){
                reject(e);
            }
        })
    }

    async verifyChain(chain){
        return new Promise(async (resolve, reject) => {
            try {
                let creation = chain.shift();
                let currentCert = await iotaHelper.getEntityCertificate(creation.entity);
                for(let msg of chain){
                    if(!MessageSigner.verifyPayload(msg, currentCert))
                        reject(new Error(`Data corrupted! Bundle ${b.hash} cannot be verified!`));
                    switch(msg.op) {
                        case Operations.TRANSFER:
                            currentCert = await iotaHelper.getEntityCertificate(msg.newEntity);
                            break;
                        case Operations.TRANSFER_TO_END_USER:
                        case Operations.UPDATE:
                        default:
                            break;
                    }
                }
                resolve(true);
            } catch(e) {
                reject(e);
            }
        });
    }

    async confirmProduct(product) {
        return new Promise(async (resolve, reject) => {
            const client = new IotaClient(product.seed);
            const payload = {
                id : product.id,
                delivered: true,
                confirmed : true,
            };
            let addr = await client.generateAddress();
            client.newTransaction(addr, 0, payload)
                .then((hash)=> {
                    resolve(hash);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }
}

module.exports = User;

