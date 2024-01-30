const Supplier = require('./packages/supplier/supplier');
const User = require('./packages/user/user');
const IotaClient = require('@iota-supply-tracer/iota-client');

async function main() {

    //Product creation
    const supplier = new Supplier(IotaClient.generateSeed());
    const product = await supplier.newProduct();
    await IotaClient.waitUntilConfirmed(product.transactionHash);
    console.log(`New product with id: ${product.id} registered [${product.transactionHash}]`);

    //Transfer to intermediary
    const intermediary = new Supplier();
    const intermediaryCert = intermediary.certificate;
    let transactionHash = await supplier.transferProduct(product, intermediaryCert);
    await IotaClient.waitUntilConfirmed(transactionHash);
    console.log(`Product with id: ${product.id} is now under custody of intermediary [${transactionHash}]`);

    //Transfer to end user
    transactionHash = await intermediary.transferProductToEndUser(product);
    await IotaClient.waitUntilConfirmed(transactionHash);
    console.log(`Product with id: ${product.id} delivered to end user [${transactionHash}]`);

    //Product confirmation
    const user = new User();
    transactionHash = await user.confirmProduct(product);
    await IotaClient.waitUntilConfirmed(transactionHash);
    console.log(`Product with id: ${product.id} is confirmed by end user [${transactionHash}]`);

}

main();