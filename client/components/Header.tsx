import React from "react"

import Link from "next/link"

import { Typography } from "@web3uikit/core"
import { ConnectButton } from "@web3uikit/web3"

const Header = () => {
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <Typography fontSize="32px" className="py-4 px-4 font-bold text-3xl">
        Ethereal Gallery
      </Typography>
      <div className="flex flex-row items-center">
        <Link className="mr-4 p-6" href="/">
          <Typography className="py-4 px-4 font-bold text-xl">Home</Typography>
        </Link>
        <Link className="mr-4 p-6" href="/list-token">
          <Typography className="py-4 px-4 font-bold text-xl">Sell NFT</Typography>
        </Link>
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  )
}

export default Header
