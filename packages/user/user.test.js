'use strict';

const User = require('./user');
const { expect } = require('chai');
const iotaHelper = require('@iota-supply-tracer/iota-helper');
describe('@iota-supply-tracer/user', () => {
    describe('confirmProduct', () => {
        it('should verify product', async () => {
            const user = new User();
            const product = {
                id: "JJQUVPSFSBZQTDIXCQAAUTFRBTWWLRNJEVHHQ9BPVNXZRONALLUQSEVTLHIDDLUEUSLA9BLXZYFWZNRDB",
                seed: "QOBWCRCWKIJUBZEBQTPWVBRCQCDECZRSJXJEOMWYVMJNJSTAIRQFMNEFQRUZCTOEJCDBAHZTNUTBKN9HZ",
                address: "MKTRLKEWIBADSVELTMVYMJRVULMH9KCLKQDDKVHSEJKKHXGZAIQQIPPLNNFBJFLKHV9NMUGRTWVZ9LRWD",
                transactionHash: "RTCHHGOLYDNEXTPOKAUR9JUFOCGSXBXOLVJLIGYUHGOKIUB9HWTYCNQUY9VHMYIJFYFNDVK9AODTA9999"
            };
            const ok = await user.verifyProduct(product);
        })
        it('should confirm reception of product', async () => {
            const user = new User();
            let mockProd = {
                id: "randomIdOfProductReceived",
                seed: iotaHelper.generateSeed()
            }
            let hash = await user.confirmProduct(mockProd);
            let transaction = await iotaHelper.readTransaction(hash);
            expect(transaction.message.id).to.be.equal(mockProd.id);
            expect(transaction.message.confirmed).to.be.true;
        })
    })
});
