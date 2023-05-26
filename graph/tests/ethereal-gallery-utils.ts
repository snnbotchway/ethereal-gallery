import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  TokenListed,
  TokenSaleCancelled,
  TokenSold
} from "../generated/EtherealGallery/EtherealGallery"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createTokenListedEvent(
  nftAddress: Address,
  seller: Address,
  price: BigInt,
  tokenId: BigInt
): TokenListed {
  let tokenListedEvent = changetype<TokenListed>(newMockEvent())

  tokenListedEvent.parameters = new Array()

  tokenListedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  tokenListedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  tokenListedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  tokenListedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return tokenListedEvent
}

export function createTokenSaleCancelledEvent(
  nftAddress: Address,
  seller: Address,
  price: BigInt,
  tokenId: BigInt
): TokenSaleCancelled {
  let tokenSaleCancelledEvent = changetype<TokenSaleCancelled>(newMockEvent())

  tokenSaleCancelledEvent.parameters = new Array()

  tokenSaleCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  tokenSaleCancelledEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  tokenSaleCancelledEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  tokenSaleCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return tokenSaleCancelledEvent
}

export function createTokenSoldEvent(
  nftAddress: Address,
  buyer: Address,
  price: BigInt,
  tokenId: BigInt
): TokenSold {
  let tokenSoldEvent = changetype<TokenSold>(newMockEvent())

  tokenSoldEvent.parameters = new Array()

  tokenSoldEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  tokenSoldEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  tokenSoldEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  tokenSoldEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return tokenSoldEvent
}
