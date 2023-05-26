/* eslint-disable react-hooks/rules-of-hooks */
import { BigNumber, ethers } from "ethers"
import type { NextPage } from "next"
import { useEffect, useState } from "react"
import {
  useChain,
  useMoralis,
  useMoralisQuery,
  useNFTBalances,
  useWeb3Contract,
} from "react-moralis"

import { Button, useNotification } from "@web3uikit/core"

import NFTBox from "../components/NFTBox"
import nftMarketplaceAbi from "../constants/abi.json"
import networkMapping from "../constants/contractAddresses.json"

type NetworkConfigMap = {
  [chainId: string]: string[]
}

type chainType =
  | "eth"
  | "0x1"
  | "ropsten"
  | "0x3"
  | "rinkeby"
  | "0x4"
  | "goerli"
  | "0x5"
  | "kovan"
  | "0x2a"
  | "polygon"
  | "0x89"
  | "mumbai"
  | "0x13881"
  | "bsc"
  | "0x38"
  | "bsc testnet"
  | "0x61"
  | "avalanche"
  | "0xa86a"
  | "avalanche testnet"
  | "0xa869"
  | "fantom"
  | "0xfa"

const ListToken: NextPage = () => {
  const dispatch = useNotification()

  const { account } = useMoralis()
  const { chainId } = useChain()
  const chainString = chainId ? parseInt(chainId).toString() : "31337"
  const currentNetworkMapping = (networkMapping as NetworkConfigMap)[chainString]

  if (!currentNetworkMapping) {
    const error = `No entry in networkMapping.json matching the current chain ID of ${chainString}`
    console.error(error)
    return <div>Error: {error}</div>
  }

  const nftMarketplaceAddress = currentNetworkMapping[0]

  // @ts-ignore
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, error, runContractFunction, isFetching, isLoading } = useWeb3Contract()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [availableProceeds, setAvailableProceeds] = useState<BigNumber | undefined>(undefined)

  const fetchAvailableProceeds = async () => {
    const options = {
      abi: nftMarketplaceAbi,
      contractAddress: nftMarketplaceAddress,
      functionName: "proceeds",
      params: {
        _address: account,
      },
    }

    const result = await runContractFunction({
      params: options,
    })

    setAvailableProceeds(result as BigNumber)
  }

  // Get NFT balances

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { getNFTBalances, data: nfts } = useNFTBalances()

  useEffect(() => {
    fetchAvailableProceeds()
    getNFTBalances({
      params: { address: account || "", chain: (chainId || "0x1") as chainType },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, getNFTBalances])

  const handleWithdraw = async () => {
    const options = {
      abi: nftMarketplaceAbi,
      contractAddress: nftMarketplaceAddress,
      functionName: "withdrawProceeds",
    }

    await runContractFunction({
      params: options,
      onSuccess: handleWithdrawSuccess,
    })
  }

  const handleWithdrawSuccess = () => {
    dispatch({
      type: "success",
      message: "Proceeds withdrawn successfully",
      title: "Proceeds Withdrawn",
      position: "topR",
    })
  }

  const { data: listedNfts } = useMoralisQuery("ActiveItem", (query) =>
    query.equalTo("seller", account).descending("tokenId")
  )

  const hasNonZeroAvailableProceeds = availableProceeds !== undefined && !availableProceeds.isZero()

  const getSellerAndPrice = (nftAddress: string, tokenId: string) => {
    const matchingListing = listedNfts.find((nft) => {
      const { nftAddress: comparisonNftAdreess, tokenId: comparisonTokenId } = nft.attributes

      return nftAddress === comparisonNftAdreess && tokenId === comparisonTokenId
    })

    return matchingListing
      ? {
          seller: matchingListing.attributes.seller,
          price: matchingListing.attributes.price,
        }
      : {
          seller: undefined,
          price: undefined,
        }
  }

  return (
    <div className="container mx-auto">
      <div className="py-4">
        <h2 className="text-2xl">Your NFTs</h2>
        <div className="flex flex-wrap">
          {nfts?.result?.map((nft) => {
            const { seller, price } = getSellerAndPrice(nft.token_address, nft.token_id)

            return (
              <NFTBox
                key={`${nft.token_address}${nft.token_id}`}
                nftAddress={nft.token_address}
                nftMarketplaceAddress={nftMarketplaceAddress}
                tokenId={nft.token_id}
                seller={seller}
                price={price}
              />
            )
          })}
        </div>
      </div>
      <div className="py-4">
        <div className="flex flex-col gap-2 justify-items-start w-fit">
          <h2 className="text-2xl">Withdraw proceeds</h2>
          {hasNonZeroAvailableProceeds ? (
            <p>
              Sales proceeds available for withdrawal:{" "}
              {ethers.utils.formatEther(availableProceeds as BigNumber)} ЕТH
            </p>
          ) : (
            <p>No withdrawable proceeds detected</p>
          )}
          <Button
            disabled={!hasNonZeroAvailableProceeds}
            id="withdraw-proceeds"
            onClick={handleWithdraw}
            text="Withdraw"
            theme="primary"
            type="button"
          />
        </div>
      </div>
    </div>
  )
}

export default ListToken
