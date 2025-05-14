require("@matterlabs/hardhat-zksync");
require("@nomicfoundation/hardhat-toolbox");

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 400
      }
    }
  },
  zksolc: {
    version: "latest",
    settings: {},
  },
  networks: {
    lensTestnet: {
      chainId: 37111,
      ethNetwork: "sepolia",
      url: "https://rpc.testnet.lens.xyz",
      verifyURL: "https://block-explorer-verify.testnet.lens.dev/contract_verification",
      zksync: true,
    },
    hardhat: {
      zksync: true,
    },
  },
}; 