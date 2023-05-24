// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ErenYeager is ERC721 {
    uint256 private s_tokenCounter = 0;

    constructor() ERC721("Eren Yeager", "EY") {
        mint();
    }

    function mint() public {
        _safeMint(msg.sender, s_tokenCounter++);
    }

    function tokenCounter() external view returns (uint256) {
        return s_tokenCounter;
    }
}
