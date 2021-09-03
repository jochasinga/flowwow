// Get all token IDs of an account.
// If a master account address is passed, then it is
// equivalent to GetAllTokenIds.
//
import PetShopContract from 0xf8d6e0586b0a20c7

// This is a read-only method.
pub fun main(addr: Address) : [UInt64] {
    let nftOwner = getAccount(addr)
    let capability = nftOwner.getCapability<&{PetShopContract.NFTReceiver}>(/public/NFTReceiver)

    let adopterRef = capability.borrow()
        ?? panic("Could not borrow the receiver reference")

    return adopterRef.getIds()
}