const { Wallet } = require("ethers");

// Generate a new random wallet
const wallet = Wallet.createRandom();

console.log("Ethereum_Address:", wallet.address);
console.log("Private_Key:", wallet.privateKey);
