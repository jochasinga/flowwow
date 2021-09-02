import WowToken from 0xWowToken

pub fun main(accountAddr: Address): UFix64 {
    // let acct1 = getAccount(0xf8d6e0586b0a20c7)
    let acct = getAccount(accountAddr)

    let acctRecipientRef = acct1.getCapability<&PetToken.Vault{WowToken.Balance}>(/public/MainRecipient)
        .borrow()
        ?? panic("Could not borrow a reference to the account's Recipient")

    log(
        "Account {} Balance is {}",
        accountAddr,
        acctRecipientRef.balance,
    )
    // log(acct1ReceiverRef.balance)
    return acct1ReceiverRef.balance
}