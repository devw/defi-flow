// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

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

    function transferWETH9ToContract(uint256 amountIn) internal {
        TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), amountIn);
    }

    function approveSwapRouter(uint256 amountIn) internal {
        TransferHelper.safeApprove(WETH9, address(swapRouter), amountIn);
    }

    function prepareSwapParams(uint256 amountIn, uint256 minOut, uint160 priceLimit) internal view returns (ISwapRouter.ExactInputSingleParams memory) {
        return ISwapRouter.ExactInputSingleParams({
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

    function executeSwap(ISwapRouter.ExactInputSingleParams memory params) internal returns (uint256) {
        return swapRouter.exactInputSingle(params);
    }

    function swapWETHForDAI(uint256 amountIn) external returns (uint256 amountOut) {
        uint256 minOut = 0; // Calculate minimum output as needed
        uint160 priceLimit = 0; // Calculate price limit as needed

        transferWETH9ToContract(amountIn);
        approveSwapRouter(amountIn);
        ISwapRouter.ExactInputSingleParams memory params = prepareSwapParams(amountIn, minOut, priceLimit);
        amountOut = executeSwap(params);
    }
}
