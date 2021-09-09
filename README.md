# 🐶 Flowwow

#### NFT Pet marketplace built on [Flow](https://onflow.org) and [NFT Storage](https://nft.storage).

### Get Started

First, make sure you have installe [Flow CLI](https://docs.onflow.org/flow-cli/install/) and sign up for [NFT.storage](https://nft.storage) account to get the API token. You will also need to have [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

1. Run the Flow chain emulator and the local dev wallet with `docker-compose up`

2. Deploy the [`PetshopContract`](./src/flow/contracts/PetshopContract.cdc) with `flow project deploy`

3. Mint the NFTs
    3.1 Add NFT storage API key in the `.env.local` file with `REACT_APP_NFTSTORAGE_API_KEY={your API token}`
    3.2 Mint the NFTs with `npm run mint-tokens`, which run the program in [`/minter`](./minter) that serializes [`pets.json`](./pets.json) and send transactions over to the local emulator and uploading images to NFT storage.
    3.3 Alternatively, if you're adding the key to a different `.env.*` file, make sure to provide the path to the file with `ENVFILE={.env.*} npm run mint-tokens`.

### Features
- [x] **Authentication** with local dev wallet
- [ ] **Authentication** with Flow-compatible wallets (testnet)
- [x] **Non-fungible Token** contract called `PetShopContract`
- [ ] **Fungible Token** for buying pet NFTs


Click Login or Signup button to
connect to a local dev wallet, which will let you choose an account. You can choose a separate account from the emulator (master) account to try adopting pets.

### Interacting with CLI

It can be helpful to directly interact with the contract(s) via the Flow CLI.  Try running the following in a separate terminal, while the emulator is running:

#### GetAllTokenIds
Get all the NFTs' IDs on the chain

`flow scripts execute ./src/flow/scripts/pets/GetAllTokenIds.cdc`

#### CheckTokenMetadata
Get the NFT's metadata from its ID

`flow scripts execute ./src/flow/scripts/pets/CheckTokenMetaData.cdc <id>`

#### MintPetToken
Mint a new NFT of your own. Check out [`pets.json`](./pets.json) to get the idea of the JSON string to pass as an argument. Don't forget to include the IPFS link in the `uri` field (or any link to an online image resource) for your NFT to show up.

`flow transactions send ./src/flow/transactions/pets/MintPetToken.cdc <JSON-string-describing-a-pet>`

## Copyrights

Dog and cat photos from Unsplash.
