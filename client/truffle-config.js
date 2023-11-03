// configure truffle project to connect to blockchain

require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
const privateKeys = process.env.PRIVATE_KEYS || "";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          // Buffer.from(privateKeys, 'hex'),
          privateKeys.split(','),
          `https://kovan.infura.io/v3/${process.env.INFURA_KOVAN_API_KEY}`
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          // Buffer.from(privateKeys, 'hex'),
          privateKeys,
          `https://ropsten.infura.io/v3/${process.env.INFURA_ROPSTEN_API_KEY}`// Url to an Ethereum Node
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      from: "0x9B978138561d737EB8E061C78B994D1a747E3449",
      network_id: 3
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      // version: "0.8.0",
      version: "0.8.9",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}