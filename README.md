# DeFi Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

# DEPLOYMENTS.md

## Sepolia Network

-   **Swap Contract**: `0x3cb29089715Dc67d73228D39073B6bf21Dd8cf2b`
-   **Deployer Address**: `0x25b...`
-   **Uniswap Router**: `0x3bF...`

| Address                                | Purpose                                                | Security Level |
| -------------------------------------- | ------------------------------------------------------ | -------------- |
| `0x3cb...` (Swap Contract)    | Your deployed contract address (share publicly)        | 🔵 **Public**  |
| `0x25b...` (Deployer Address) | Your EOA (Externally Owned Account) - **keep private** | 🔴 **Private** |
| `0x3bF...` (Uniswap Router)   | Sepolia's Uniswap router (public infrastructure)       | 🔵 **Public**  |
