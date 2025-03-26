require("dotenv").config();
const { ethers } = require("hardhat");

const main = async () => {
    const [signer] = await ethers.getSigners(); // Get the signer (your wallet)
    console.log("Using account:", signer.address);

    // Contract address of the deployed contract
    const contractAddress = "0xc90F75633540CFA9A5cD34e9456E3c509A61a107";

    // ABI with the getWETHBalance function
    const abi = ["function getWETHBalance() external view returns (uint256)"];

    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Call the getWETHBalance function
    const balance = await contract.getWETHBalance();
    console.log("WETH Balance in Contract:", ethers.utils.formatUnits(balance, 18)); // WETH is typically 18 decimals
}

main().catch((err) => console.log(err));
