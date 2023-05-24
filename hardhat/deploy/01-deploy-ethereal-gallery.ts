import { network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"

import { HardhatRuntimeEnvironment } from "hardhat/types"

import { verify } from "../helper-functions"
import { isLocalNetwork, networkConfig } from "../helper-hardhat-config"

const func: DeployFunction = async ({
    getNamedAccounts,
    deployments,
}: HardhatRuntimeEnvironment) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId!
    const currentNetwork = networkConfig[chainId]

    const args: [] = []
    const etherealGallery = await deploy("EtherealGallery", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: currentNetwork.waitConfirmations,
    })
    log("=====================================================================")

    if (!isLocalNetwork && process.env.ETHERSCAN_API_KEY) {
        await verify(etherealGallery.address, args)
        log("=====================================================================")
    }
}

func.tags = ["etherealGallery"]
export default func
