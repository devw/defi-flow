# DeFi Project

This project demonstrates a simple DeFi contract that facilitates the swapping of WETH9 for DAI using the Uniswap V3 protocol. The contract utilizes the SwapRouter from Uniswap to perform token swaps on behalf of the users. It allows users to transfer WETH9 into the contract and automatically execute a trade to convert it into DAI, ensuring seamless decentralized exchange interaction.

Try running some of the following tasks:

```shell
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

# DEPLOYMENTS

## Sepolia Network

-   **Swap Contract**: `0x3cb29089715Dc67d73228D39073B6bf21Dd8cf2b`
-   **Deployer Address**: `0x25b...`
-   **Uniswap Router**: `0x3bF...`

| Address                       | Purpose                                                | Security Level |
| ----------------------------- | ------------------------------------------------------ | -------------- |
| `0x3cb...` (Swap Contract)    | Your deployed contract address (share publicly)        | 🔵 **Public**  |
| `0x25b...` (Deployer Address) | Your EOA (Externally Owned Account) - **keep private** | 🔴 **Private** |
| `0x3bF...` (Uniswap Router)   | Sepolia's Uniswap router (public infrastructure)       | 🔵 **Public**  |

## Verify your smart contract

The command `npx hardhat verify --network sepolia` is used to verify your smart contract on the Etherscan block explorer for the Sepolia network.

```
npx hardhat verify --network sepolia \
<deployed_contract_address> \
<Uniswap-SwapRouter-Address> \
<DAI-Address> \
<WETH9-Address>
```

For reference, please see the deployed contract at:
https://sepolia.etherscan.io/address/0xc90F75633540CFA9A5cD34e9456E3c509A61a107#code

Where:
- Contract Address: 0xc90F75633540CFA9A5cD34e9456E3c509A61a107
- Blockchain: Ethereum Sepolia Testnet
- Access: Full source code verification available via Etherscan

To verify a new smart contract, execute the following command:
```
node scripts/verify.js sepolia <Contract Address>
```

To retrieve the balance stored within the smart contract, execute the following command in your terminal: 
```
npx hardhat run scripts/get-weth-balance.js --network sepolia
```