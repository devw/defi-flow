// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Swap {
    ISwapRouter public immutable swapRouter;
    address public immutable DAI;
    address public immutable WETH9;
    uint24 public constant feeTier = 3000;

    constructor(ISwapRouter _swapRouter, address _DAI, address _WETH9) {
        swapRouter = _swapRouter;
        DAI = _DAI;
        WETH9 = _WETH9;
    }

    // Function to transfer WETH to this contract (user must approve the transfer)
    function transferWETH9ToContract(uint256 amountIn) internal {
        TransferHelper.safeTransferFrom(
            WETH9,
            msg.sender,
            address(this),
            amountIn
        );
    }

    // Function to allow this contract to approve WETH transfer to the swap router
    function approveSwapRouter(uint256 amountIn) internal {
        TransferHelper.safeApprove(WETH9, address(swapRouter), amountIn);
    }

    // Function to receive ETH (if you want to store ETH directly in the contract)
    receive() external payable {
        // You could emit an event here for logging
    }

    // Function to check the WETH balance of the contract
    function getWETHBalance() external view returns (uint256) {
        return IERC20(WETH9).balanceOf(address(this)); // Get the WETH balance of the contract
    }

    // Preparing the swap parameters for Uniswap V3
    function prepareSwapParams(
        uint256 amountIn,
        uint256 minOut,
        uint160 priceLimit
    ) internal view returns (ISwapRouter.ExactInputSingleParams memory) {
        return
            ISwapRouter.ExactInputSingleParams({
                tokenIn: WETH9,
                tokenOut: DAI,
                fee: feeTier,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: minOut,
                sqrtPriceLimitX96: priceLimit
            });
    }

    // Execute the swap transaction
    function executeSwap(
        ISwapRouter.ExactInputSingleParams memory params
    ) internal returns (uint256) {
        return swapRouter.exactInputSingle(params);
    }

    // Function to swap WETH for DAI
    function swapWETHForDAI(
        uint256 amountIn
    ) external returns (uint256 amountOut) {
        uint256 minOut = 0; // Calculate minimum output as needed
        uint160 priceLimit = 0; // Calculate price limit as needed

        // Transfer WETH to the contract
        transferWETH9ToContract(amountIn);
        
        // Approve the swap router to spend WETH
        approveSwapRouter(amountIn);

        // Prepare swap parameters
        ISwapRouter.ExactInputSingleParams memory params = prepareSwapParams(
            amountIn,
            minOut,
            priceLimit
        );

        // Execute the swap and return the output
        amountOut = executeSwap(params);
    }
}
