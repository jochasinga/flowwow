pub contract PetShopContract {

    pub var ownerMap: {UInt64 : Address}

    // Resources are items stored in user accounts and
    // accessible through access control measures.
    pub resource NFT {

        // Unique identifier for each NFT.
        pub let id: UInt64

        init(initId: UInt64) {
            self.id = initId
        }
    }

    // Resource interface defines the "capabilities"
    // available to others (users who are not the contract owner)
    // These are methods the NFTReceiver will be able to call.
    pub resource interface NFTReceiver {

        pub fun withdraw(withdrawId: UInt64): @NFT

        // deposit an NFT to this NFTReceiver
        pub fun deposit(token: @NFT, metadata: {String : String})

        // getIds of all NFTs belonging to this account
        pub fun getIds(): [UInt64]

        // check if an NFT with an ID exists in this account
        pub fun idExists(id: UInt64): Bool

        // Get metadata of an NFT
        pub fun getMetadata(id: UInt64) : {String : String}
    }

    // A collection defines a "wallet" that houses all of a user's NFT.
    // Inherits from the NFTReceiver interface.
    pub resource Collection: NFTReceiver {
        pub var ownedNFTs: @{UInt64: NFT}
        pub var metadataObjs: {UInt64: { String : String }}

        init() {
            self.ownedNFTs <- {}
            self.metadataObjs = {}
        }

        destroy() {
            destroy self.ownedNFTs
        }

        pub fun withdraw(withdrawId: UInt64): @NFT {
            let token <- self.ownedNFTs.remove(key: withdrawId)
            return <- token!
        }

        pub fun deposit(token: @NFT, metadata: {String : String}) {
            self.metadataObjs[token.id] = metadata
            self.ownedNFTs[token.id] <-! token
        }

        // idExists checks to see if an NFT
        // with the given ID exists in the collection.
        pub fun idExists(id: UInt64): Bool {
            return self.ownedNFTs[id] != nil
        }

        // getIds returns an array of the IDs that are in the collection
        pub fun getIds(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun getMetadata(id: UInt64): {String : String} {
            // return self.ownedNFTs[id]?.metadata!
             // let token <- self.ownedNFTs[id]!
            // return token.metadata
            return self.metadataObjs[id]!
        }

        pub fun updateMetadata(id: UInt64, metadata: {String: String}) {
            self.metadataObjs[id] = metadata
            // let token <- self.ownedNFTs[id]!
            // token.metadata = metadata
            // self.ownedNFTs[id] <- token
            // self.ownedNFTs[id].metadata! = metadata
            // self.ownedNFTs[id]?.updateMetadata(metadata: metadata)
        }
    }

    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    // The minting resource.
    pub resource NFTMinter {
        pub var idCount: UInt64

        init() {
            self.idCount = 1
        }

        pub fun mint(): @NFT {
            var newNFT <- create NFT(initId: self.idCount)

            PetShopContract.ownerMap[self.idCount] = PetShopContract.account.address

            self.idCount = self.idCount + 1 as UInt64

            return <-newNFT
        }
    }

    // This contract constructor is called once when the  contract is deployed.
    // It does the following:
    //
    // - Creating an empty Collection for the deployer of the collection so
    //   the owner of the contract can mint and own NFTs from that contract.
    //
    // - The `Collection` resource is published in a public location with reference
    //   to the `NFTReceiver` interface. This is how we tell the contract that the functions defined
    //   on the `NFTReceiver` can be called by anyone.
    //
    // - The `NFTMinter` resource is saved in the account storage for the creator of
    //   the contract. Only the creator can mint tokens.
    init() {
        self.ownerMap = {}
        self.account.save(<-self.createEmptyCollection(), to: /storage/NFTCollection)
        self.account.link<&{NFTReceiver}>(/public/NFTReceiver, target: /storage/NFTCollection)
        self.account.save(<-create NFTMinter(), to: /storage/NFTMinter)
    }

}