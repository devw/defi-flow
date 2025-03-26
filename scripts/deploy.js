const hre = require("hardhat");
const { getNetworkConfig } = require("../utils/config");

const getDeployer = async () => {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    return deployer;
};

const checkBalance = async (deployer) => {
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
};

const deploySwapContract = async (swapRouter, dai, weth) => {
    const Swap = await hre.ethers.getContractFactory("Swap");
    const swap = await Swap.deploy(swapRouter, dai, weth);
    await swap.waitForDeployment();
    return swap;
};

const main = async () => {
    const deployer = await getDeployer();
    await checkBalance(deployer);

    const network = hre.network.name;
    const { swapRouter, dai, weth } = await getNetworkConfig(network);

    console.log(`Deploying on ${network}...`);
    console.log("SwapRouter:", swapRouter);
    console.log("DAI:", dai);
    console.log("WETH:", weth);

    const swap = await deploySwapContract(swapRouter, dai, weth);
    console.log("\n✅ Deployment successful!");
    console.log("Swap contract deployed to:", await swap.getAddress());
};

main().catch((err) => console.log(err));
