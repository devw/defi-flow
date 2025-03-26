const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getNetworkConfig } = require("../utils/config");

describe("Swap Contract", function () {
    let swapContract;
    let owner;
    let WETH9;
    let DAI;
    let swapRouter;

    before(async function () {
        [owner] = await ethers.getSigners();
        const network = hre.network.name; // Example: 'sepolia' or 'mainnet'
        ({ swapRouter, dai: DAI, weth: WETH9 } = await getNetworkConfig(network));

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
