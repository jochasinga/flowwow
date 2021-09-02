// Check
import PetShopContract from 0xf8d6e0586b0a20c7

// This is a read-only method.
pub fun main(id: UInt64) : {String : String} {
    log("Getting token data of ID: ")
    log(id)
    let nftOwner = getAccount(0xf8d6e0586b0a20c7)
    log("NFT Owner")
    let capability = nftOwner.getCapability<&{PetShopContract.NFTReceiver}>(/public/NFTReceiver)

    let adopterRef = capability.borrow()
        ?? panic("Could not borrow the receiver reference")

    // return receiverRef.getMetadata(id: 1)
    return adopterRef.getMetadata(id: id)
}