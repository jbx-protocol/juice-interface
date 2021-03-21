// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract Projects is ERC721, Ownable {
    constructor() ERC721("Juice project", "PROJECT") {}

    function create(address _to) external onlyOwner returns (uint256 id) {
        id = totalSupply() + 1;
        _safeMint(_to, id);
    }
}
