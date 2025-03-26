require("dotenv").config();
const { ethers } = require("hardhat");

const main = async () => {
    const [signer] = await ethers.getSigners(); // Get the signer (your wallet)
    console.log("Using account:", signer.address);

    // Contract address of the deployed contract
    const contractAddress = "0x9FD6b6693BE719E2169f4E81B97d1E59325305dD";

    // ABI with the getWETHBalance function
    const abi = ["function getWETHBalance() external view returns (uint256)"];

    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Call the getWETHBalance function
    const balance = await contract.getWETHBalance();
    console.log("WETH Balance in Contract:", ethers.formatUnits(balance, 18)); // WETH is typically 18 decimals
};

main().catch((err) => console.log(err));
