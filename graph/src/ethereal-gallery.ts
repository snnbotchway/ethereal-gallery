import {
	TokenListed as TokenListedEvent,
	TokenSaleCancelled as TokenSaleCancelledEvent,
	TokenSold as TokenSoldEvent,
} from "../generated/EtherealGallery/EtherealGallery";
import { TokenListed, TokenSaleCancelled, TokenSold } from "../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts/common/numbers";

export function handleTokenListed(event: TokenListedEvent): void {
	const id = getTokenId(event.params.tokenId, event.params.nftAddress);

	let listedToken = TokenListed.load(id);
	if (listedToken === null) listedToken = new TokenListed(id);

	listedToken.nftAddress = event.params.nftAddress;
	listedToken.seller = event.params.seller;
	listedToken.price = event.params.price;
	listedToken.tokenId = event.params.tokenId;
	listedToken.isActive = true;

	listedToken.save();
}

export function handleTokenSaleCancelled(event: TokenSaleCancelledEvent): void {
	const id = getTokenId(event.params.tokenId, event.params.nftAddress);

	let listedToken = TokenListed.load(id)!;
	listedToken.isActive = false;
	listedToken.save();

	let tokenSaleCancel = TokenSaleCancelled.load(id);
	if (tokenSaleCancel === null) tokenSaleCancel = new TokenSaleCancelled(id);

	tokenSaleCancel.nftAddress = event.params.nftAddress;
	tokenSaleCancel.seller = event.params.seller;
	tokenSaleCancel.price = event.params.price;
	tokenSaleCancel.tokenId = event.params.tokenId;
	tokenSaleCancel.save();
}

export function handleTokenSold(event: TokenSoldEvent): void {
	const id = getTokenId(event.params.tokenId, event.params.nftAddress);

	let listedToken = TokenListed.load(id)!;
	listedToken.isActive = false;
	listedToken.save();

	let tokenSold = TokenSold.load(id);
	if (tokenSold === null) tokenSold = new TokenSold(id);

	tokenSold.nftAddress = event.params.nftAddress;
	tokenSold.buyer = event.params.buyer;
	tokenSold.price = event.params.price;
	tokenSold.tokenId = event.params.tokenId;
	tokenSold.save();
}

function getTokenId(tokenId: BigInt, nftAddress: Address): string {
	return nftAddress.toHexString() + tokenId.toHexString();
}
