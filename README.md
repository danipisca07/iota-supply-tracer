# Iota Supply Tracer
<img src="https://img.shields.io/badge/Open-Source-brightgreen" />
<p align="center">
    <img src="assets/logo.png" />
</p>

The IOTA-SUPPLY-TRACER is a **proof of concept** to demonstrate how easy it can be to build a **supply chain tracking solution on the IOTA tangle**.  
Using the library is possible to easy create a new product which state is monitored and updated via messages stored on the IOTA tangle.  
The main advantage of using iota (instead of any other blockchain) is the complete lack of fees, which allows both supplier and user goods to easly use the decentralized ledger to read and update status **without any cost**.

## Table of Contents
  - [How does it work](#how-does-it-work) 
    - [Suppliers identification](#suppliers-identification)
    - [Product seed](#product-seed)
    - [Chain of custody](#chain-of-custody)
  - [Dependencies](#dependencies)
  - [Installation](#installation)
  - [Usage](#usage)
  - [FAQs](#faqs)
  - [Contributing](#contributing)
  - [License](#license)

  How can an address be verified to be owned by an entity?

## How does it work

### Suppliers identification
Each message published on the tangle by a supplier is signed with a cryptographic signature in the *signature* property. And is also marked with a *entity* property containing the address of the signing entity.

The address in the *entity* property is the iota wallet address where the complete certificate of the specific identity is published. Any user simply by checking which is the last transaction in that specified address can find the certificate of that identity.

Once the certificate is retreived, the original message can be verified using the public key contained in the certificate.  

### Product seed

All the informations regarding the chain of custody of a product are stored as messages inside transactions. All the transactions are generated from addresses of the **product seed**.

The **product seed** is a seed that is generated when the new product is created by the supplier. This seed is then stored in some form on the physical product itself (as barcode, QR code, NFC tag ecc..). This means that anyone that gets physical hold of the product also knows the product seed.

### Chain of custody
Additionally to the ownership of the product seed, a certificate mechanism is in place to trace the custody of a product.

When a product is created a message from it's [product seed](#product-seed) is published on the tangle. This message contains information on the product and the certificate of the producer.

Structure of the creation message:
```js
{
  id: 'unique identifier of the product',
  op: 'creation',
  entity: 'address of the entity',
  signature: 'message signature'
}
```
The entity property contains an address that points to the entity certificate of the supplier [see suppliers identification](#suppliers-identification).
Any following update on the product that is published with another message on the tangle must be always signed with a signature that can be verified with the same entity certificate. This allows any user to verify that all status update on the tangle have actually been published by the supplier (which is the only owner of the private key associated to the certificate).

The custody or ownership of a product can also be transferred to another supplier with a message that identifies the next entity. From that message going forward, only the messages signed with the new certificate will be considered valid.

End users are not supposed to have any certificate. When the last supplier delivers the product to the end user the last transaction with a signature is published on the tangle, all the messages published by the user (using the product seed) will not have any certificate or signature.

## Dependencies

You need [Node.js](https://nodejs.org/en/) installed on your machine. 
All package dependencies are handled by npm and lerna.

## Installation

Clone repo locally:
```bash
git clone https://github.com/danipisca07/iota-supply-tracer
cd iota-supply-tracer
```
Install all dependencies in one command:
```bash
npx lerna bootstrap
```
## Usage
The library can be used by the two packages inside the packages folder:  
- Supplier: Package used by the suppliers of products to:  
    - Create new product
    - Update status/location of a product
    - Transfer custody of a product to another supplier
    - Transfer custody of a product to the end-user
- User: Package used by end-user of products to:
    - Verify chain of custody of received product
    - Confirm reception of product

Example usage:
```js
//Product creation
const supplier = new Supplier();
await supplier.init();
const product = await supplier.newProduct();

//Transfer of product custody to intermediary
const intermediary = new Supplier();
await intermediary.init();
await supplier.transferProduct(product, intermediary.getCurrentCertificate());

//Transfer of product custody to end-user
await intermediary.transferProductToEndUser(product);

//Verify and confirm product reception
const user = new User();
const productChain = await user.getSupplyChain(product);
const verified = await user.verifyChain(productChain);
if(verified)
    await user.confirmProduct(product);
```

For a complete example see [test.js](test.js).

## FAQs

### Entity address verification
**How can an address be verified to be owned by an entity?**

One the IOTA tangle each address is owned by whomever owns the private key connected to that specific address (the public key). So how can an user be sure that a specific entity address is really who that entity claims to be?

This problem lies outside of what the iota tangle addresses, this means that it must be solved using some external verification method. The solution implemeted is using a website to verify an entity address. To this purpose, inside each certificate of each entity a *website* property is present. This property can be used by any user to verify 

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)