// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./abstract/Administered.sol";

contract Projects is ERC721, Administered {
    constructor() ERC721("Juice project", "JUICE PROJECT") {}

    function create() external onlyAdmin returns (uint256 id) {
        id = totalSupply() + 1;
        _safeMint(msg.sender, id);
    }
}
