// This actually link the Vault's capability to deposit
// that is restricted to the fields and functions in the `Recipient`
// and `Balance` interfaces, only exposing the balance field and
// deposit function of the underlying Vault.
//
import WowToken from 0xf8d6e0586b0a20c7

transaction {
    // Note that we pass the account that owns the WowToken contract.
    // Only this account can link capabilities to another domain.
    // Note that here only the `Recipient` and `Balance` interfaces
    // are linked to the public domain, so the public accounts can never
    // call `withdraw` a.k.a be the sender without the contract owner
    // explicitly granting the access.
    //
    prepare(acct: AuthAccount) {
        acct.link<&PetToken.Vault{WowToken.Recipient, PetToken.Balance}>(/public/MainRecipient, target: /storage/MainVault)

        log("Public Recipient reference created!")
    }

    // Check that the capability is linked properly to the public domain.
    post {
        getAccount(0xf8d6e0586b0a20c7).getCapability<&WowToken.Vault{WowToken.Recipient}>(/public/MainRecipient)
            .check():
            "Vault Receiver Reference was not created correctly"
    }
}