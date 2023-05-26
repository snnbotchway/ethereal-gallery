import { gql } from "@apollo/client"

export default gql`
    {
        tokenListeds(where: { isActive: true }) {
            id
            nftAddress
            seller
            price
            tokenId
        }
    }
`
