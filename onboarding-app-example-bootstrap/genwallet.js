const { Wallet } = require("ethers");

// Generate a new random wallet
const wallet = Wallet.createRandom();

console.log("Ethereum Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);
