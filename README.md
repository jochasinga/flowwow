# Flowwow

A scaffold for NFT marketplace built on [Flow](https://onflow.org) and [nft.storage](https://nft.storage)

## Features
- **Authentication** in Flow-compatible wallets
- **Non-fungible Token** contract called `PetShop`
- **Fungible Token** contract called `WowToken` for buying pets

## Getting Started

- Install [Flow CLI](https://docs.onflow.org/flow-cli/install/)
- Sign up for [NFT.storage](https://nft.storage) account
- run `flow init` inside the root directory to create `flow.json`
- run `flow emulator` to start the emulator (local chain)

In the `flow.json` file, modify the following sections to look like the following:

```json
{
    "contracts": {
		"PetShopContract": "./contracts/PetShopContract.cdc",
        "WowTokenContract": "./contracts/WowTokenContract.cdc"
	},
}
```
```json
{
    "deployments": {
		"emulator": {
			"emulator-account": ["PetShopContract", "WowTokenContract"]
		}
	}
}
```

- Then, run `flow project deploy` to deploy [`PetShopContract`](./contracts/PetShopContract.cdc) and [`WowTokenContract`](./contracts/WowTokenContract.cdc) to the emulator account, taking note of the contract address returned, beginning with `0x`).


## Creating Accounts

To create a local account, run `flow key generate` to generate a private key, then add to `flow.json`. The file should look like this:

```json
{
	"emulators": {
		"default": {
			"port": 3569,
			"serviceAccount": "emulator-account"
		}
	},
	"contracts": {
		"PetShopContract": "./contracts/PetShopContract.cdc"
	},
	"networks": {
		"emulator": "127.0.0.1:3569",
		"mainnet": "access.mainnet.nodes.onflow.org:9000",
		"testnet": "access.devnet.nodes.onflow.org:9000"
	},
	"accounts": {
		"emulator-account": {
			"address": <YOUR-GENERATED-ADDRESS>,
            "privateKey": <YOUR-PRIVATE-KEY>,
            "chain": "flow-emulator",
            "sigAlgorithm": "ECDSA_P256",
            "hashAlgorithm": "SHA3_256"
		}
	},
	"deployments": {
		"emulator": {
			"emulator-account": ["PetShopContract", "WowTokenContract"]
		}
	}
}
```
If you need additional accounts (which are useful in testing transferring some WOW tokens to and buy some pets with), run as many as you need, adding to the `accounts` section of `flow.json`:

```json
	"accounts": {
		"emulator-account": {
			"address": <YOUR-GENERATED-ADDRESS>,
            "privateKey": <YOUR-PRIVATE-KEY>,
            "chain": "flow-emulator",
            "sigAlgorithm": "ECDSA_P256",
            "hashAlgorithm": "SHA3_256"
		},
        "account-1": {
            "address": <GENERATED-ADDRESS>,
            "privateKey": <GENERATED-PRIVATE-KEY>,
            "chain": "flow-emulator",
            "sigAlgorithm": "ECDSA_P256",
            "hashAlgorithm": "SHA3_256"
        }
	},
```

## Interacting with CLI

- Run `flow transactions send ./transactions/MintPet.cdc --signer emulator-account` to mint the first pet token to your own account
- To check the NFT token's metadata to verify if it is successfully minted, run the [`CheckTokenMetadata`](./scripts/pets/CheckTokenMetadata.cdc) script with `flow scripts execute ./scripts/pets/CheckTokenMetadata.cdc`.

## Copyrights

Dog photos by <a href="https://unsplash.com/@karsten116?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Karsten Winegeart</a> on <a href="https://unsplash.com/s/photos/dog?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
