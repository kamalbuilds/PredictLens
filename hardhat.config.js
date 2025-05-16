require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");
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
    version: "1.5.12",
    settings: {
      codegen: "evmla",
    },
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
  // Specify where to find deployment scripts
  paths: {
    deploy: "./deploy",
  },
}; 