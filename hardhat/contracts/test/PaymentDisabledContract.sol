// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {EtherealGallery} from "../EtherealGallery.sol";
import {ErenYeager} from "./ErenYeager.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

error PaymentDisabledContract__NotEnoughEth(uint256 amountSent);

/**
 * @title PaymentDisabledContract
 * @author Solomon Botchway
 * @notice This contract cannot receive ether after it is deployed.
 * @dev This is a mock contract to test the WithdrawalFailed error on EtherealGallery.
 */
contract PaymentDisabledContract is IERC721Receiver {
    EtherealGallery private s_etherealGallery;
    ErenYeager private s_erenYeager;
    uint256 public tokenId;

    constructor() payable {}

    function setContractAddresses(EtherealGallery etherealGallery, ErenYeager erenYeager) external {
        s_etherealGallery = etherealGallery;
        s_erenYeager = erenYeager;
    }

    function listToken(uint256 price) external {
        mintToken();
        approveMarketPlace();
        s_etherealGallery.listToken(s_erenYeager, tokenId, price);
    }

    function withdrawProceeds() external {
        s_etherealGallery.withdrawProceeds();
    }

    function mintToken() private {
        ErenYeager erenYeager = s_erenYeager;
        erenYeager.mint();
        tokenId = erenYeager.tokenCounter() - 1;
    }

    function approveMarketPlace() private {
        s_erenYeager.approve(address(s_etherealGallery), tokenId);
    }

    function onERC721Received(
        address /* operator */,
        address /* from */,
        uint256 /* tokenId */,
        bytes calldata /* data */
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
