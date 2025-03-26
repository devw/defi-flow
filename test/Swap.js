const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

describe("Swap Contract", function () {
    let swapContract;
    let owner;
    let WETH9;
    let DAI;
    let swapRouter;

    before(async function () {
        // Get the deployer's address
        [owner] = await ethers.getSigners();

        // Load network configuration
        const network = hre.network.name; // Example: 'sepolia' or 'mainnet'
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

        // Extract contract addresses from config
        ({ swapRouter, dai: DAI, weth: WETH9 } = networkConfig[network]);

        console.log(`Running tests on ${network}...`);
        console.log("SwapRouter:", swapRouter);
        console.log("DAI:", DAI);
        console.log("WETH:", WETH9);

        // Deploy the Swap contract with the Uniswap Router address
        const Swap = await ethers.getContractFactory("Swap");
        swapContract = await Swap.deploy(swapRouter, DAI, WETH9);

        // Wait for contract deployment
        await swapContract.waitForDeployment();
    });

    it("Should have the correct WETH9 and DAI addresses", async function () {
        expect(await swapContract.WETH9()).to.equal(WETH9);
        expect(await swapContract.DAI()).to.equal(DAI);
    });
});
