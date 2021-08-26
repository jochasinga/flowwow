# flow-petshop

NFT petshop on [Flow](https://onflow.org) and [nft.storage](https://nft.storage) (WIP)

## Get started

- Install [Flow CLI](https://docs.onflow.org/flow-cli/install/)
- Sign up for [NFT.storage](https://nft.storage) account
- run `flow init` inside the root directory to create `flow.json`
- run `flow emulator` to start the emulator (local chain)

In the `flow.json` file, modify the following sections:

```json
{
    // ...

    "contracts": {
		"PetShopContract": "./contracts/PetShopContract.cdc"
	},

    // ...

    "deployments": {
		"emulator": {
			"emulator-account": ["PetShopContract"]
		}
	}
}
```

- Then, run `flow project deploy` to deploy the [`PetShopContract`](./contracts/PetShopContract.cdc) to the emulator, taking note of the contract address returns (beginning with `0x`).

- Run `flow key generate` to generate keys, then add the private key to `flow.json`. The file should look like this:

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
			"emulator-account": ["PetShopContract"]
		}
	}
}
```

- Run `flow transactions send ./transactions/MintPet.cdc --signer emulator-account` to mint the first pet token to your own account
- To check if the NFT token's metadata, run the [`CheckTokenMetadata`](./scripts/CheckTokenMetadata.cdc) script with `flow scripts execute ./scripts/CheckTokenMetadata.cdc`.

## Copyrights

Dog photos by <a href="https://unsplash.com/@karsten116?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Karsten Winegeart</a> on <a href="https://unsplash.com/s/photos/dog?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
