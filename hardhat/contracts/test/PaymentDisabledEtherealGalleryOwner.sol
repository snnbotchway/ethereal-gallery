// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.18;

import {EtherealGallery} from "../EtherealGallery.sol";

error PaymentDisabledEtherealGalleryOwner__NotEnoughEth(uint256 amountSent);

contract PaymentDisabledEtherealGalleryOwner {
    EtherealGallery private immutable i_etherealGallery;

    constructor() payable {
        i_etherealGallery = new EtherealGallery();
    }

    function etherealGallery() external view returns (EtherealGallery) {
        return i_etherealGallery;
    }

    function withdrawOwnerBalance() external {
        i_etherealGallery.withdrawOwnerBalance();
    }
}
