import WowToken from 0xWowToken

// This transaction is a template for a transaction that
// could be used by anyone to send tokens to another account
// that owns a Vault.
//
transaction {
    // Temporary Vault object that holds the balance that is being transferred.
    var tempVault: @WowToken.Vault

    // Recipient's account address.
    var recipientAddr: Address

    prepare(
        acct: AuthAccount,
        amount: UFix64,
        recipientAddr: Address
    ) {
        // withdraw tokens from your vault by borrowing a reerence to it
        // and calling the withdraw function with that reference.
        let vaultRef = acct.borrow<&WowToken.Vault>(from: /storage/MainVault)
            ?? panic("Could not borrow a reference to the owner's vault")

        self.tempVault <-vaultRef.withdraw(amount: amount)
        self.recipientAddr = recipientAddr
    }

    execute {
        // get the recipient's public account object
        let recipient = getAccount(self.recipientAddr)

        let recipientRef = recipient.getCapability(/public/MainRecipient)
                            .borrow<&WowToken.Vault{WowToken.Recipient}>()
                            ?? panic("Could not borrow a reference to the recipient")

        // Deposit your tokens to their Vault
        receiverRef.deposit(from: <-self.tempVault)

        log("Transfer succeeded!")
    }
}