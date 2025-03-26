const { exec } = require("child_process");
const { getNetworkConfig } = require("../utils/config");

const verifyContract = async (network, deployedContractAddress) => {
    if (!network || !deployedContractAddress) {
        return logError("Please provide both the network and deployed contract address.");
    }

    const networkConfig = await getNetworkConfig(network);
    const { swapRouter, dai, weth } = networkConfig;
    const command = buildCommand(network, deployedContractAddress, swapRouter, dai, weth);

    console.log(`Running command: ${command}`);
    executeCommand(command);
};

const buildCommand = (network, deployedContractAddress, swapRouter, dai, weth) =>
    `npx hardhat verify --network ${network} ${deployedContractAddress} ${swapRouter} ${dai} ${weth}`;

const executeCommand = (command) => {
    exec(command, (stdout, stderr) => {
        if (stderr) return handleError(stderr);
        console.log(`stdout: ${stdout}`);
    });
};

const handleError = (stderr) => {
    throw new Error(`stderr: ${stderr}`);
};

const logError = (message) => console.log(message);

const network = process.argv[2]; // Network parameter (sepolia, mainnet, etc.)
const deployedContractAddress = process.argv[3]; // Deployed contract address

verifyContract(network, deployedContractAddress);
