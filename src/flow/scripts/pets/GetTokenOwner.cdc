// Get all Token IDs belonging to the master account.
import PetShopContract from 0xf8d6e0586b0a20c7

// This is a read-only method.
pub fun main(id: UInt64) : Address {
    return PetShopContract.ownerMap[id]!
}