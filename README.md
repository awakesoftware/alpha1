# Prototype 1 for Awake Software

![Awake Logo](backend/public/awakelogo.png)

[React.js](https://reactjs.org/) project bootstrapped with [create-react-app](https://github.com/facebook/create-react-app)


## Stack
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [Next](https://nextjs.org/)
- [Material-ui](https://mui.com/)
- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Jest](https://jestjs.io/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Ethereum](https://ethereum.org/en/)
- [Web3](https://github.com/ChainSafe/web3.js)
- [MetaMask](https://metamask.io/)
- [Kovan Testnet](https://kovan.etherscan.io/address/0x9674dF2b0E96d51A0c74a4725911aaD6C4B6F77C)
- [Kovan Eth Faucets - Chainlink](https://faucets.chain.link/)
- [Kovan Eth Faucets - MyCrypto](https://app.mycrypto.com/faucet)


## Install

Make sure you have [node.js 16](https://nodejs.org/en/) and [npm 7.12.0](https://www.npmjs.com/) installed.

Installing dependencies:

### Server dependencies
From the `/alpha1/` directory:
```bash
cd /backend/
```

```bash
npm i
```

### Client dependencies
From the `/alpha1/` directory:
```bash
cd /client/
```

```bash
npm i
```


## Environment Variables
From the `/alpha1/` directory:
```bash
cd /backend/
```

create a `.env` file and add the following:

```bash
ENVIRONMENT = staging

# Staging ENV
STAGING_DATABASE = 
STAGING_DATABASE_NAME = 'AP1 STAGING'
STAGING_PORT = 5000
STAGING_PORT_URL = http://localhost:5000
STAGING_CLIENT = 3000
STAGING_CLIENT_URL = http://localhost:3000

# Production ENV
PRODUCTION_DATABASE = 
PRODUCTION_DATABASE_NAME = 'AP1 PRODUCTION'
PRODUCTION_PORT = 5001
PRODUCTION_PORT_URL = http://localhost:5001
PRODUCTION_CLIENT = 3001
PRODUCTION_CLIENT_URL = http://localhost:3001


# API Data
SENDGRID_API_KEY = 
EMAIL_TO = seth@powelsonfamily.net
EMAIL_FROM = support@awakestudios.net
SECRET = 
JWT_ACCOUNT_ACTIVATION = 
JWT_RESET_PASSWORD = 
```

From the `/alpha1/` directory:
```bash
cd /client/
```

create a `.env` file and add the following:

```bash
ENVIRONMENT = staging

# Staging ENV
STAGING_PORT = 5000
STAGING_PORT_URL = http://localhost:5000
STAGING_CLIENT = 3000
STAGING_CLIENT_URL = http://localhost:3000

# Production ENV
PRODUCTION_PORT = 5001
PRODUCTION_PORT_URL = http://localhost:5001
PRODUCTION_CLIENT = 3001
PRODUCTION_CLIENT_URL = http://localhost:3001


# Ethereum Data
PRIVATE_KEY = 
PRIVATE_KEYS = 

INFURA_KOVAN_API_KEY = 
INFURA_ROPSTEN_API_KEY = 
```


## Getting Started

### Running the development server:

From the `/alpha1/backend/` directory:
```bash
nodemon app
```

Open [http://localhost:5000/](http://localhost:5000/) with your browser.

- API endpoint example: [http://localhost:5000/api/users](http://localhost:5000/api/users)


### Running the client app:

From the `/alpha1/client/` directory:
```bash
npm start
```

Open [http://localhost:3000/](http://localhost:3000/) with your browser.

### Build

From the `/alpha1/client/` directory:
```sh
npm run build
```


## Acquiring Test Eth

Make sure your MetaMask account is setup and is connected to the Kovan Testnet. Ensure that our site is added to the list of connected sites on MetaMask (or else you wont be able to work with videos).

Go to either Kovan Eth Faucet and add their site to your list of connected sites on your main MetaMask account. Add your main account number to the sites input field and submit the request. It will come in 0.1 increments.


## Notes

> Note: Currently using the Ethereum blockchain and the Kovan Testnet.
> Note: If we switch to the EOSIO blockchain, ensure that `/alpha1/.vscode/c_cpp_properties.json` contains:
```json
{
    "configurations": [
        {
            "name": "Mac",
            "includePath": [
                "${workspaceFolder}/**",
                "/usr/local/opt/eosio.cdt/opt/eosio.cdt/include/**",
                "/usr/local/opt/eosio.cdt/opt/eosio.cdt/include/eosiolib/**",
                "/usr/local/opt/eosio.cdt/opt/eosio.cdt/include/eosiolib/contracts/**",
                "/usr/local/opt/eosio.cdt/opt/eosio.cdt/include/eosiolib/contracts/eosio/**",
                "/usr/local/opt/eosio.cdt/opt/eosio.cdt/include/eosiolib/core/**",
                "/usr/local/opt/eosio.cdt/opt/eosio.cdt/include/eosiolib/core/eosio/**",
                "/usr/local/opt/eosio.cdt/opt/eosio.cdt/include/boost/**"
            ],
            "defines": [
                "uint128_t=__uint128_t",
                "int128_t=__int128_t"
            ],
            "compilerPath": "/usr/bin/clang",
            "cStandard": "c11",
            "cppStandard": "c++17",
            "intelliSenseMode": "macos-clang-x64"
        }
    ],
    "version": 4
}
```
> and `/alpha1/.vscode/settings.json` contains:
```json
{
    "files.associations": {
        "iostream": "cpp",
        "iosfwd": "cpp",
        "__bit_reference": "cpp",
        "__functional_base": "cpp",
        "__node_handle": "cpp",
        "algorithm": "cpp",
        "bitset": "cpp",
        "chrono": "cpp",
        "deque": "cpp",
        "__memory": "cpp",
        "filesystem": "cpp",
        "functional": "cpp",
        "iterator": "cpp",
        "limits": "cpp",
        "memory": "cpp",
        "optional": "cpp",
        "ratio": "cpp",
        "system_error": "cpp",
        "tuple": "cpp",
        "type_traits": "cpp",
        "vector": "cpp",
        "atomic": "cpp"
    },
    "git.ignoreLimitWarning": true,
    "emmet.includeLanguages": {
        "javascript": "javascriptreact"
    },
    "emmet.triggerExpansionOnTab": true
}
```


#### Copyright (C) May 2021 - Awake Software, LLC - All Rights Reserved
    * Unauthorized copying of this file(s) and/or software, via any medium is strictly prohibited
    * Proprietary and confidential
    * Written by [Awake Software, LLC](https://github.com/awakesoftware) - May 2021