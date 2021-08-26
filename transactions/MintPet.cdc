import PetShopContract from 0xf8d6e0586b0a20c7

transaction {
    let receiverRef: &{PetShopContract.NFTReceiver}
    let minterRef: &PetShopContract.NFTMinter

    // Take the account info of the user trying to execute the transaction and validate.
    // Here we try to "borrow" the capabilities available on `NFTMinter` and `NFTReceiver`
    // resources, and will fail if the user executing this transaction does not have access
    // to these resources.
    prepare(acct: AuthAccount) {
        self.receiverRef = acct.getCapability<&{PetShopContract.NFTReceiver}>(/public/NFTReceiver)
            .borrow()
            ?? panic("Could not borrow receiver reference")
        self.minterRef = acct.borrow<&PetShopContract.NFTMinter>(from: /storage/NFTMinter)
            ?? panic("Could not borrow minter reference")
    }

    execute {
        let metadata : {String : String} = {
            "name": "Iggy",
            "breed": "French Bulldog",
            "sex": "Female",
            "color": "Brown",

            // `ipfs` scheme is the correct reference for a file on IPFS. It can be used with
            // IPFS's desktop client and browser extension, and natively supported in Brave browser.
            "uri": "ipfs://bafkreib6sjwicehehpyeolffk7utttowgts4ic24gnxgx3pxpjbwixpyka"
        }
        let newNFT <- self.minterRef.mint()
        self.receiverRef.deposit(token: <-newNFT, metadata: metadata)
        log("NFT Minted and deposited to Account 2's Collection")
    }
}