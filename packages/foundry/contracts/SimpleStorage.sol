// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract SimpleStorage {
    uint256 public storedData;

    event DataSet(address indexed from, uint256 value);

    function setData(uint256 x) external {
        storedData = x;
        emit DataSet(msg.sender, x);
    }
}
