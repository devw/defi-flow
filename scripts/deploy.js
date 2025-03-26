const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Check balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

    // Load network addresses
    const network = hre.network.name; // Example: 'mainnet' or 'sepolia'
    const configPath = path.join(__dirname, "../config/networks.json");

    if (!fs.existsSync(configPath)) {
        console.error("❌ Config file not found:", configPath);
        process.exit(1);
    }

    const networkConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    if (!networkConfig[network]) {
        console.error(`❌ No config found for network: ${network}`);
        process.exit(1);
    }

    const { swapRouter, dai, weth } = networkConfig[network];

    console.log(`Deploying on ${network}...`);
    console.log("SwapRouter:", swapRouter);
    console.log("DAI:", dai);
    console.log("WETH:", weth);

    // Deploy Swap contract
    const Swap = await hre.ethers.getContractFactory("Swap");
    const swap = await Swap.deploy(swapRouter, dai, weth);

    await swap.waitForDeployment();

    console.log("\n✅ Deployment successful!");
    console.log("Swap contract deployed to:", await swap.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
