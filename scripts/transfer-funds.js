require("dotenv").config();
const { ethers } = require("ethers");

// Load the .env variables
const privateKey = process.env.PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(privateKey, provider);

// Contract addresses
const contractAddress = process.env.CONTRACT_ADDRESS; // Your deployed contract address
const WETH_ADDRESS = process.env.WETH_ADDRESS; // WETH contract address

// ABI for the WETH contract to approve transfer, transfer WETH, and wrap ETH
const WETH_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address recipient, uint256 amount) public returns (bool)",
    "function deposit() public payable", // Wrap ETH into WETH
    "function withdraw(uint256 wad) public" // Withdraw WETH to ETH
];

const main = async () => {
    const [, , amountIn] = process.argv;

    if (!amountIn) {
        console.error("Please provide the amount of WETH to transfer.");
        return;
    }

    const amount = ethers.parseUnits(amountIn, 18); // WETH has 18 decimals

    console.log(`Transferring ${amountIn} WETH to the contract at ${contractAddress}`);

    // Create the WETH contract instance
    const wethContract = new ethers.Contract(WETH_ADDRESS, WETH_ABI, wallet);

    // Ensure the wallet has enough ETH to wrap into WETH
    const ethBalance = await provider.getBalance(wallet.address);
    console.log('ETH Balance:', ethBalance.toString());  // Log ETH balance to see its value

    if (ethBalance.lt(amount)) {
        console.error("Insufficient ETH to wrap into WETH.");
        return;
    }

    // Wrap ETH into WETH if needed
    if (ethBalance.gte(amount)) {
        console.log(`Wrapping ${ethers.formatUnits(amount, 18)} ETH into WETH...`);
        const wrapTx = await wethContract.deposit({ value: amount });
        await wrapTx.wait();
        console.log("ETH successfully wrapped into WETH.");
    }

    // Ensure the wallet has enough WETH
    const balance = await wethContract.balanceOf(wallet.address);
    console.log('WETH Balance:', balance.toString());  // Log WETH balance to see its value

    if (balance.lt(amount)) {
        console.error("Insufficient WETH balance to transfer.");
        return;
    }

    // Approve the contract to transfer WETH on behalf of the user
    console.log("Approving the contract to spend WETH...");
    const approveTx = await wethContract.approve(contractAddress, amount);
    await approveTx.wait();

    console.log("Approval granted. Transferring WETH to the contract...");

    // Transfer the WETH to the contract
    const transferTx = await wethContract.transfer(contractAddress, amount);
    await transferTx.wait();

    console.log(`${amountIn} WETH successfully transferred to the contract.`);
};

main().catch((error) => console.error(error));
