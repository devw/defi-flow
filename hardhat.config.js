require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.7.6",
    networks: {
        sepolia: {
            url: process.env.ALCHEMY_API_URL,
            accounts: [process.env.PRIVATE_KEY], // Remove the 0x prefix from here
        },
    },
    etherscan: {
        apiKey: {
            sepolia: process.env.ETHERSCAN_API_KEY, // Replace with your Sepolia API key
        },
    },
    sourcify: {
        enabled: true,
    },
};
