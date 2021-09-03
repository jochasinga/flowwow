// Check
import PetShopContract from 0xf8d6e0586b0a20c7

transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&PetShopContract.Collection>(from: /storage/NFTCollection) != nil {
            log("Yes")
        } else {
            log("No")
        }
    }
}
