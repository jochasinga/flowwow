// Check
import PetShopContract from 0xf8d6e0586b0a20c7

transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&PetShopContract.NFTMinter>(from: /storage/NFTMinter) != nil {
            log("Yes")
        } else {
            log("No")
        }
    }
}
