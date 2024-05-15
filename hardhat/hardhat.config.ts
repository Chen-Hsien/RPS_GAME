import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      chainId: 11155111,
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },

  etherscan: {
    apiKey: process.env.SEPOLIA_API_KEY,
},
};

export default config;
