// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.18;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

error EtherealGallery__MarketplaceNotApprover(uint256 tokenId);
error EtherealGallery__CallerNotTokenOwner(uint256 tokenId);
error EtherealGallery__WithdrawalFailed(uint256 amount);
error EtherealGallery__PriceIsZero();
error EtherealGallery__NoProceedsForCaller();
error EtherealGallery__NoBalanceForOwner();
error EtherealGallery__ExactPriceNotMet(uint256 amountSent, uint256 actualPrice);
error EtherealGallery__TokenNotListed(address nftAddress, uint256 tokenId);

contract EtherealGallery is Ownable {
    struct TokenForSale {
        uint256 price;
        address seller;
    }

    uint256 private s_ownerBalance;
    mapping(address => mapping(uint256 => TokenForSale)) private s_tokenListings;
    mapping(address => uint256) private s_proceeds;

    event TokenListed(
        address indexed nftAddress,
        address indexed seller,
        uint256 indexed price,
        uint256 tokenId
    );
    event TokenSold(
        address indexed nftAddress,
        address indexed buyer,
        uint256 indexed price,
        uint256 tokenId
    );
    event TokenSaleCancelled(
        address indexed nftAddress,
        address indexed seller,
        uint256 indexed price,
        uint256 tokenId
    );

    /**
     * @notice Lists your NFT for sale if this contract is the approver of your token.
     * @param nftContract The contract address of the NFT.
     * @param tokenId The tokenId of the NFT.
     * @param price The price you wish to sell the NFT. It is subject to a 2% fee when the NFT is sold and
     * so you will receive 98% of the price when someone buys your listed NFT.
     */
    function listToken(IERC721 nftContract, uint256 tokenId, uint256 price) external {
        if (nftContract.getApproved(tokenId) != address(this))
            revert EtherealGallery__MarketplaceNotApprover(tokenId);
        if (nftContract.ownerOf(tokenId) != msg.sender)
            revert EtherealGallery__CallerNotTokenOwner(tokenId);
        if (price == 0) revert EtherealGallery__PriceIsZero();

        s_tokenListings[address(nftContract)][tokenId] = TokenForSale({
            price: price,
            seller: msg.sender
        });

        emit TokenListed(address(nftContract), msg.sender, price, tokenId);
    }

    /**
     *@param nftAddress The NFT contract address.
     * @param tokenId The id of the token you wish to buy.
     */
    function buyToken(address nftAddress, uint256 tokenId) external payable {
        TokenForSale memory listing = s_tokenListings[nftAddress][tokenId];
        (uint price, address seller) = (listing.price, listing.seller);

        delete s_tokenListings[nftAddress][tokenId];

        if (price == 0) revert EtherealGallery__TokenNotListed(nftAddress, tokenId);
        if (msg.value != price) revert EtherealGallery__ExactPriceNotMet(msg.value, price);

        uint256 tokenSaleFee = getTokenSaleFee(price);
        s_ownerBalance += tokenSaleFee;
        s_proceeds[seller] += price - tokenSaleFee;

        IERC721(nftAddress).safeTransferFrom(seller, msg.sender, tokenId);

        emit TokenSold(nftAddress, msg.sender, price, tokenId);
    }

    function cancelTokenSale(address nftAddress, uint256 tokenId) external {
        TokenForSale memory listing = s_tokenListings[nftAddress][tokenId];

        if (IERC721(nftAddress).ownerOf(tokenId) != msg.sender && listing.seller != msg.sender)
            revert EtherealGallery__CallerNotTokenOwner(tokenId);

        delete s_tokenListings[nftAddress][tokenId];

        emit TokenSaleCancelled(nftAddress, msg.sender, listing.price, tokenId);
    }

    function withdrawProceeds() external {
        uint256 _proceeds = s_proceeds[msg.sender];
        if (_proceeds == 0) revert EtherealGallery__NoProceedsForCaller();

        s_proceeds[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: _proceeds}("");
        if (!success) revert EtherealGallery__WithdrawalFailed(_proceeds);
    }

    function withdrawOwnerBalance() external onlyOwner {
        uint256 _ownerBalance = s_ownerBalance;
        if (_ownerBalance == 0) revert EtherealGallery__NoBalanceForOwner();

        s_ownerBalance = 0;

        (bool success, ) = msg.sender.call{value: _ownerBalance}("");
        if (!success) revert EtherealGallery__WithdrawalFailed(_ownerBalance);
    }

    /**
     * @notice Returns 2% of the price.
     */
    function getTokenSaleFee(uint256 price) private pure returns (uint256) {
        return (price * 2) / 100;
    }

    function ownerBalance() external view returns (uint256) {
        return s_ownerBalance;
    }

    function tokenListing(
        address nftAddress,
        uint256 tokenId
    ) external view returns (TokenForSale memory) {
        return s_tokenListings[nftAddress][tokenId];
    }

    function proceeds(address _address) external view returns (uint256) {
        return s_proceeds[_address];
    }
}
