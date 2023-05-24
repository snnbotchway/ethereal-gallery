import { ethers, network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"

import { HardhatRuntimeEnvironment } from "hardhat/types"

import { isLocalNetwork, networkConfig } from "../helper-hardhat-config"

const func: DeployFunction = async ({
    getNamedAccounts,
    deployments,
}: HardhatRuntimeEnvironment) => {
    if (!isLocalNetwork) return

    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId!
    const currentNetwork = networkConfig[chainId]

    log("=====================================================================")
    await deploy("ErenYeager", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: currentNetwork.waitConfirmations,
    })
    log("=====================================================================")

    await deploy("PaymentDisabledContract", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: currentNetwork.waitConfirmations,
        value: ethers.utils.parseEther("1"),
    })
    log("=====================================================================")

    await deploy("PaymentDisabledEtherealGalleryOwner", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: currentNetwork.waitConfirmations,
        value: ethers.utils.parseEther("1"),
    })
    log("=====================================================================")
}

func.tags = ["mocks"]
export default func
