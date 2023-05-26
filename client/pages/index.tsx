import { useQuery } from "@apollo/client"
import { useMoralis } from "react-moralis"

import { Inter } from "next/font/google"

import NFTBox from "@/components/NFTBox"

import networkConfig from "@/constants/contractAddresses.json"
import GET_ACTIVE_TOKENS from "@/constants/subgraphQueries"

interface nftInterface {
  price: number
  nftAddress: string
  tokenId: string
  address: string
  seller: string
}

interface contractAddressesInterface {
  [key: string]: string[]
}

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  const { chainId } = useMoralis()
  const addresses: contractAddressesInterface = networkConfig
  const marketplaceAddress = chainId ? addresses[parseInt(chainId!).toString()][0] : null

  const { loading, data: listedNfts } = useQuery(GET_ACTIVE_TOKENS)

  return (
    <main className={`container mx-auto ${inter.className}`}>
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap">
        {loading || !listedNfts ? (
          <div>Loading...</div>
        ) : (
          listedNfts.tokenListeds.map((nft: nftInterface /*, index*/) => {
            const { price, nftAddress, tokenId, seller } = nft

            return (
              <NFTBox
                price={price}
                nftAddress={nftAddress}
                tokenId={tokenId}
                nftMarketplaceAddress={marketplaceAddress!}
                seller={seller}
                key={`${nftAddress}${tokenId}`}
              />
            )
          })
        )}
      </div>
    </main>
  )
}
