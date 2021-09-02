// Check
import PetShopContract from 0xf8d6e0586b0a20c7

// This is a read-only method.
pub fun main() : [UInt64] {
    let nftOwner = getAccount(0xf8d6e0586b0a20c7)
    let capability = nftOwner.getCapability<&{PetShopContract.NFTReceiver}>(/public/NFTReceiver)
    let receiverRef = capability.borrow()
        ?? panic("Could not borrow the receiver reference")

    return receiverRef.getIds()
}