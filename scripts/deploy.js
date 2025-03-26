const hre = require("hardhat");
const fs = require('node:fs/promises');
const path = require("path");

const getDeployer = async () => {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    return deployer;
};

const checkBalance = async (deployer) => {
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
};

const loadNetworkConfig = async () => {
    const configPath = path.join(__dirname, "../config/networks.json");
    const configData = await fs.readFile(configPath, "utf-8");
    return JSON.parse(configData);
};

const getNetworkConfig = (network, networkConfig) => {
    if (!networkConfig[network]) throw new Error(`No config found for network: ${network}`);
    return networkConfig[network];
};

const deploySwapContract = async (swapRouter, dai, weth) => {
    const Swap = await hre.ethers.getContractFactory("Swap");
    const swap = await Swap.deploy(swapRouter, dai, weth);
    await swap.waitForDeployment();
    return swap;
};

const main = async () => {
    try {
        const deployer = await getDeployer();
        await checkBalance(deployer);

        const network = hre.network.name;
        const networkConfig = await loadNetworkConfig();
        const { swapRouter, dai, weth } = getNetworkConfig(network, networkConfig);

        console.log(`Deploying on ${network}...`);
        console.log("SwapRouter:", swapRouter);
        console.log("DAI:", dai);
        console.log("WETH:", weth);

        const swap = await deploySwapContract(swapRouter, dai, weth);
        console.log("\n✅ Deployment successful!");
        console.log("Swap contract deployed to:", await swap.getAddress());
    } catch (error) {
        console.error(error);
        process.exitCode = 1;
    }
};

main();
