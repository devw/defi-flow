// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;

contract Lock {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        _setUnlockTime(_unlockTime);
        _setOwner();
    }

    function _setUnlockTime(uint _unlockTime) internal {
        require(block.timestamp < _unlockTime, "Unlock time should be in the future");
        unlockTime = _unlockTime;
    }

    function _setOwner() internal {
        owner = payable(msg.sender);
    }

    function withdraw() public {
        _checkUnlockTime();
        _checkOwnership();
        _emitWithdrawal();
        _transferFunds();
    }

    function _checkUnlockTime() internal view {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
    }

    function _checkOwnership() internal view {
        require(msg.sender == owner, "You aren't the owner");
    }

    function _emitWithdrawal() internal {
        emit Withdrawal(address(this).balance, block.timestamp);
    }

    function _transferFunds() internal {
        owner.transfer(address(this).balance);
    }
}
