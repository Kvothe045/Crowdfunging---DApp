require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const Sepolia_URL = process.env.Sepolia_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: Sepolia_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
