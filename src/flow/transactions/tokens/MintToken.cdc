import WowToken from 0xWowToken

transaction {
    let mintingRef: &WowToken.VaultMinter

    var receiver: Capability<&WowToken.Vault{WowToken.Receiver}>

    prepare(acct: AuthAccount) {
        self.mintingRef = acct.borrow<&WowToken.VaultMinter>(from: /storage/MainMinter)
            ?? panic("Could not borrow a reference to the minter")

        let recipient = getAccount(0xf8d6e0586b0a20c7)

        self.recipient = recipient.getCapability<&WowToken.Vault{WowToken.Receiver}>(/public/MainRecipient)
    }

    execute {
        self.mintingRef.mintTokens(amount: 10.0, recipient: self.receiver)

        log("10 tokens minted and deposited to account 0xf8d6e0586b0a20c7")
    }
}