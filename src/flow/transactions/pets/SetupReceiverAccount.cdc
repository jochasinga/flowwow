import PetShopContract from 0xf8d6e0586b0a20c7

transaction {
    prepare(acct: AuthAccount) {
        // Create a new empty collection for this account
        let collection <- PetShopContract.createEmptyCollection()

        // store the empty collection in the account storage
        acct.save<@PetShopContract.Collection>(<-collection, to: /storage/NFTCollection)

        log("Collection created for account")

        // Create a public capability for the collection.
        // This is so that the sender account can deposit the token
        // to this account's collection.
        acct.link<&{PetShopContract.NFTReceiver}>(/public/NFTReceiver, target: /storage/NFTCollection)

        log("Capability created")
    }
}

