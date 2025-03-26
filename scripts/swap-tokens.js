// const { ethers } = require("hardhat");
const { ethers } = require("hardhat");
const fs = require("node:fs/promises");
const path = require("path");

const getNetworkConfig = async (network) => {
    const configPath = path.join(__dirname, "../config/networks.json");
    const configData = await fs.readFile(configPath, "utf-8");
    return JSON.parse(configData)[network];
};

const getContractAddresses = (networkConfig) => ({
    swapRouter: networkConfig.swapRouter,
    dai: networkConfig.dai,
    weth: networkConfig.weth,
});

const getSwapContract = (swapRouterAddress, signer) => {
    const swapContractABI = ["function swapWETHForDAI(uint256 amountIn) external returns (uint256)"];
    return new ethers.Contract(swapRouterAddress, swapContractABI, signer);
};

const getSigner = async () => {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    return deployer;
};

const getAmountIn = () => ethers.parseEther("1", 18); // 1 WETH

const initiateSwap = async (swapContract, amountIn, deployer) => {
    console.log("Initiating swap...");
    const tx = await swapContract.swapWETHForDAI(amountIn);
    const receipt = await tx.wait();
    console.log("Transaction hash before wait:", tx.hash);
    console.log("Transaction hash:", receipt.hash || receipt.transactionHash);
};

const main = async () => {
    const network = "sepolia"; // Or change this based on your desired network
    const networkConfig = await getNetworkConfig(network);
    const { swapRouter } = getContractAddresses(networkConfig);

    const signer = await getSigner();
    const swapContract = getSwapContract(swapRouter, signer);

    const amountIn = getAmountIn();
    await initiateSwap(swapContract, amountIn, signer);
};

main().then(() => console.log("Swap executed successfully!"));
