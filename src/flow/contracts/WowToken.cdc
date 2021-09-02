// Fungible token that is used as a currency for the Flowwow petshop.
pub contract WowToken {

    // We keep track of the total supply of all tokens in circulation.
    pub var totalSupply: UFix64
    // Nice to have a cool name that sticks.
    pub var tokenName: String

    // Sender a.k.a "Provider"
    //
    // This interface enforces the strong requirements for withdrawing
    // tokens from the implementing type.
    //
    // We could enforce requirements on self.balance here to always make
    // sure it is not possible to spend more than the balance.
    // However, we don't do it here because it leavs open the possibility
    // of creating custom providers that don't necessarily need their own
    // balance.
    // 
    // We could have named it anything other than Sender.
    //
    pub resource interface Sender {

        // withdraw
        //
        // This function subtracts tokens from the owner's Vault
        // and returns a Vault resource (@Vault) with the removed tokens.
        //
        pub fun withdraw(amount: UFix64): @Vault {

            // post hook gets called after the execution of the withdraw
            // function on the implementing type.
            post {
                // `result` refers to the return value of the function (@Vault).
                result.balance == UFix64(amount):
                    "Withdrawal amount must be the same as the balance of the withdrawn Vault"
            }
        }
    }

    // Recipient a.k.a "Receiver"
    //
    // This interface enforces the requirements for depositing
    // WowTokens into the implementing type.
    //
    // We don't include a condition that checks the balance
    // because we want to give users the ability to make custom
    // Recipients that can do custom things with the tokens, like
    // split them up and send them to different places.
    //
    pub resource interface Recipient {
        // deposit
        //
        // Can be caled to deposit tokens into the implementing
        // resource type.
        //
        // Here we are not enforcing anything on the implementing
        // type other than that it needs to implement this function.
        //
        pub fun deposit(from: @Vault)
    }

    // Balance
    //
    // Specifies a public `balance` field for the vault.
    //
    pub resource interface Balance {
        pub var balance: UFix64
    }

    // Vault a.k.a "$$Bag"
    //
    // Each user stores an instance of only the Vault in their storage
    // The functions in the Vault and governed by the pre and post
    // conditions in the interfaces when they are called.
    // The checks happen at runtime whenever a function is called.
    //
    // Resources can only be created in the context of the contract that
    // they are defined in (in this case, WowToken), so there is no way
    // for a malicious user to create Vaults out of thin air.
    // A special Minter resource needs to be defined to mint new tokens.
    //
    pub resource Vault: Sender, Recipient, Balance {

        // keeps track of the total balance of the account's tokens.
        pub var balance: UFix64

        // Initialize the balance at resource creation time.
        init(balance: UFix64) {
            self.balance = balance
        }

        // withdraw
        //
        // Implementation of a `Sender` Interface.
        // Takes an integer amount as an argument and withdraws
        // that amount from the Vault.
        //
        pub fun withdraw(amount: UFix64): @Vault {
            self.balance = self.balance - amount
            return <-create Vault(balance: amount)
        }

        // deposit
        //
        // Implements the `Recipient` Interface.
        // Takes a Vault resource as an argument and adds
        // its balance to the balance of the owners' Vault.
        //
        // Note that it's allowed to destroy the sent Vault because
        // the Vault was a temporary holder of the tokens. The Vault's
        // balance has been consumed and therefore can be destroyed.
        pub fun deposit(from: @Vault) {
            self.balance = self.balance + from.balance
            destroy from
        }
    }

    // createEmptyVault
    //
    // Creates a new empty Vault with a balance of 0.0
    // and returns it to the caller. A user must call this function
    // and store the returned Vault in their storage in order to allow
    // their account to be able to receive deposits of this token type.
    //
    pub fun createEmptyVault(): @Vault {
        return <-create Vault(balance: UFix64(0))
    }

    // VaultMinter
    //
    // Resource that an admin can control to mint new tokens.
    pub resource VaultMinter {

        // Mints new tokens and deposits into an account's vault
        // using their `Recipient` reference.
        // We say `&AnyResource{Receiver}` to say that the recipient can be any
        // resource as long as it implements the Recipient interface.
        pub fun mintTokens(amount: UFix64, recipient: Capability<&AnyResource{Recipient}>) {
            let recipientRef = recipient!.borrow()
                ?? panic("Could not borrow a receiver reference to the vault")

            // Update the total circulating supply of tokens.
            WowToken.totalSupply = WowToken.totalSupply + UFix64(amount)
            recipientRef.deposit(from: <-create Vault(balance: amount))
        }
    }

    // The init function for the WowToken contract. All fields in the contract
    // must be initialized at deployment. This is just an example of what
    // an implementation could do in the init function.
    init() {
        self.totalSupply = UFix64(1000000)
        self.tokenName = "WOW"

        // create the Vault with the initial balance and put it in storage
        // account.save saves an object to the specified `to` path.
        //
        // The path is a literal path that consists of a "domain" and "identifier"
        // The domain must be one of `storage`, `private`, or `public`
        // while the identifier can be arbitrary.
        //
        let vault <- create Vault(balance: self.totalSupply)

        // The path `/storage/MainVault` is a "central" @Vault only the account 
        // owner can have access to.
        self.account.save(<-vault, to: /storage/MainVault)

        let minter <- create VaultMinter()
        self.account.save(<-minter, to: /storage/MainMinter)

        // Link the capability of the @VaultMinter to the private domain so accounts
        // with access to it can call.
        self.account.link<&VaultMinter>(/private/Minter, target: /storage/MainMinter)
    }
}