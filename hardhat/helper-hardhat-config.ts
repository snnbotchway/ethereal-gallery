import { network } from "hardhat"

type NetworkConfigItem = {
    name: string
    waitConfirmations: number
}

type NetworkConfigMap = {
    [chainId: string]: NetworkConfigItem
}

export const networkConfig: NetworkConfigMap = {
    default: {
        name: "hardhat",
        waitConfirmations: 1,
    },
    31337: {
        name: "localhost",
        waitConfirmations: 1,
    },
    11155111: {
        name: "sepolia",
        waitConfirmations: 6,
    },
}

const developmentChains: string[] = ["hardhat", "localhost"]
export const isLocalNetwork = developmentChains.includes(network.name)
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6
