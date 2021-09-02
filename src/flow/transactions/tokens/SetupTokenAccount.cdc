// Set up a Vault for an Account so it can receive
// WOW tokens, a.k.a become the Recipient.
// 
// Owning tokens requires an account to have a @Vault
// object stored in its account, so if anyone tries to send
// tokens to an account who isn't prepared to receive them,
// the transaction will fail and rollback.
//
import WowToken from 0xWowToken

// This transaction configures an account to store and receive
// tokens defined by the WowToken contract.
transaction {
    prepare(acct: AuthAccount) {
        // Create a new empty Vault object
        let vault <- WowToken.createEmptyVault()

        // store the vault in this account storage
        acct.save<@WowToken.Vault>(<-vault, to: /storage/MainVault)

        log("Empty Vault stored")

        // Create a public Recipient capability to the Vault
        let RecipientRef = acct.link<&WowToken.Vault{WowToken.Recipient, WowToken.Balance}>(
            /public/MainRecipient,
            target: /storage/MainVault
        )

        log("References created")

        post {
            // Check that the capabilities were created correctly.
            getAccount(0xWowToken)
        }
    }
}

