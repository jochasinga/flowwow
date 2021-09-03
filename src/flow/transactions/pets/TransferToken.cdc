import PetShopContract from 0xf8d6e0586b0a20c7

// This transaction transfers an NFT from one user's collection
// to another user's collection.
transaction(tokenId: UInt64, recipientAddr: Address) {

    // The field that will hold the NFT as it is being
    // ransferred to the other account
    let transferToken: @PetShopContract.NFT

    prepare(acct: AuthAccount) {
        let masterAccount = getAccount(0xf8d6e0586b0a20c7)
        let collectionRef = masterAccount.getCapability<&PetShopContract.Collection>(from: /storage/NFTCollection)
            .borrow()
            ?? panic("Could not borrow a reference to the master owner's collection")

        // Borrow a reference from the stored collection
        // let collectionRef = acct.borrow<&PetShopContract.Collection>(from: /storage/NFTCollection)
        //     ?? panic("Could not borrow a reference to the owner's collection")

        // Call the withdraw function on the sender's Collection
        // to move the NFT out of the collection
        self.transferToken <- collectionRef.withdraw(withdrawId: tokenId)
    }

    execute {
        // Get the recipient's public account object
        let recipient = getAccount(recipientAddr)

        // Get the Collection reference for the receiver
        // getting the public capability and borrowing a reference from it
        let receiverRef = recipient.getCapability<&{PetShopContract.NFTReceiver}>(/public/NFTReceiver)
            .borrow()
            ?? panic("Could not borrow receiver reference")

        // Deposit the NFT in the receivers collection
        receiverRef.deposit(token: <-self.transferToken)

        log("NFT transferred from sender to recipient account")
    }
}

