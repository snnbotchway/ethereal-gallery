import { ethers } from "ethers"
import type { NextPage } from "next"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"

import Image from "next/image"

import { Card, Illustration, Tooltip, useNotification } from "@web3uikit/core"

import nftAbi from "@/constants/ERC721.json"
import nftMarketplaceAbi from "@/constants/abi.json"

import { SellNFTModal } from "./SellNFTModal"
import { UpdateListingModal } from "./UpdateListingModal"

interface NFTBoxProps {
  price?: number
  nftAddress: string
  tokenId: string
  nftMarketplaceAddress: string
  seller?: string
}

const truncateStr = (fullStr: string, strLen: number) => {
  if (fullStr.length <= strLen) return fullStr

  const separator = "..."

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2)

  return (
    fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars)
  )
}

const NFTBox: NextPage<NFTBoxProps> = ({
  price,
  nftAddress,
  tokenId,
  nftMarketplaceAddress,
  seller,
}: NFTBoxProps) => {
  const { isWeb3Enabled, account } = useMoralis()
  const [imageURI, setImageURI] = useState<string | undefined>()
  const [tokenName, setTokenName] = useState<string | undefined>()
  const [tokenDescription, setTokenDescription] = useState<string | undefined>()
  const [showModal, setShowModal] = useState(false)
  const hideModal = () => setShowModal(false)
  const isListed = seller !== undefined
  const dispatch = useNotification()

  const { runContractFunction: getTokenURI, data: tokenURI } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: { tokenId },
  })

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: nftMarketplaceAddress,
    functionName: "buyToken",
    msgValue: price,
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    },
  })

  async function updateUI() {
    console.log(`TokenURI is: ${tokenURI}`)
    // We are cheating a bit here...
    if (tokenURI) {
      const requestURL = (tokenURI as string).replace("ipfs://", "https://ipfs.io/ipfs/")
      const tokenURIResponse = await (await fetch(requestURL)).json()
      const imageURI = tokenURIResponse.image
      const imageURIURL = (imageURI as string).replace("ipfs://", "https://ipfs.io/ipfs/")
      setImageURI(imageURIURL)
      setTokenName(tokenURIResponse.name)
      setTokenDescription(tokenURIResponse.description)
    }
  }

  useEffect(() => {
    updateUI()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenURI])

  useEffect(() => {
    async function main() {
      await getTokenURI()
    }

    if (isWeb3Enabled) main()
  }, [isWeb3Enabled, getTokenURI])

  const isOwnedByUser = seller === account || seller === undefined
  const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)

  const handleCardClick = async function () {
    if (isOwnedByUser) {
      setShowModal(true)
    } else {
      console.log(nftMarketplaceAddress)
      await buyItem({
        onSuccess: () => handleBuyItemSuccess(),
        onError: (error) => {
          console.log(error)
        },
      })
    }
  }

  const handleBuyItemSuccess = () => {
    dispatch({
      type: "success",
      message: "Item bought successfully",
      title: "Item Bought",
      position: "topR",
    })
  }

  const tooltipContent = isListed ? (isOwnedByUser ? "Update listing" : "Buy me") : "Create listing"

  return (
    <div className="p-2">
      <SellNFTModal
        isVisible={showModal && !isListed}
        imageURI={imageURI}
        nftAbi={nftAbi}
        nftMarketplaceAbi={nftMarketplaceAbi}
        nftAddress={nftAddress}
        tokenId={tokenId}
        onClose={hideModal}
        nftMarketplaceAddress={nftMarketplaceAddress}
      />
      <UpdateListingModal
        isVisible={showModal && isListed}
        imageURI={imageURI}
        nftMarketplaceAbi={nftMarketplaceAbi}
        nftAddress={nftAddress}
        tokenId={tokenId}
        onClose={hideModal}
        nftMarketplaceAddress={nftMarketplaceAddress}
        currentPrice={price}
      />
      <Card title={tokenName} description={tokenDescription} onClick={handleCardClick}>
        <Tooltip content={tooltipContent} position="top">
          <div className="p-2">
            {imageURI ? (
              <div className="flex flex-col items-end gap-2">
                <div>#{tokenId}</div>
                <div className="italic text-sm">Owned by {formattedSellerAddress}</div>
                <Image loader={() => imageURI} src={imageURI} height="200" width="200" alt={""} />
                {price && <div className="font-bold">{ethers.utils.formatEther(price)} ETH</div>}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Illustration height="180px" logo="lazyNft" width="100%" />
                Loading...
              </div>
            )}
          </div>
        </Tooltip>
      </Card>
    </div>
  )
}
export default NFTBox
