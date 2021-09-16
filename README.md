# 🐶 Flowwow

Flowwow is an NFT pet marketplace built on [Flow](https://onflow.org) and [NFT Storage](https://nft.storage). It is intended to be a demo of how to mint and manage NFTs on the Flow blockchain, storing them in IPFS and Filecoin via the NFT.storage service. You can browse delightful pets, adopt them (transfer from marketplace to your wallet), and release them (transfer from your wallet back to the marketplace).

### Prerequisites

First, make sure you install [Flow CLI](https://docs.onflow.org/flow-cli/install/) and sign up for a [NFT.storage](https://nft.storage) account to get the API token. You will also need to have [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

### Get Started

1. Run the Flow chain emulator and the local dev wallet with `docker-compose up`

2. Deploy the [`PetshopContract`](./src/flow/contracts/PetshopContract.cdc) with `flow project deploy`

3. Optional: Pre-mint the NFTs
    - Add NFT storage API key in the `.env.local` file with `REACT_APP_NFTSTORAGE_API_KEY={your API token}`
    - Mint the NFTs with `npm run mint-tokens`, which run the program in [`/minter`](./minter) that serializes [`pets.json`](./pets.json) and send transactions over to the local emulator and uploading images to NFT storage.
    - Alternatively, if you're adding the key to a different `.env.*` file, make sure to provide the path to the file with `ENVFILE={.env.*} npm run mint-tokens`.

4. Click Login or Signup button to connect to a local dev wallet, which will let you choose an account. You can choose a separate account from the emulator (service account) or create new ones. Then, select "Activate Collection" under the dropdown menu for every new account.

5. Try minting, adopting (transfer from marketplace to you), and releasing (transferring back to the marketplace) pet NFTs.

> 💡 Pre-minting all pets with the command line will mint and deposit them to the emulator's (service account's) address, ready to be transferred to another logged in account.
>
> Without the pre-minting, the logged in user will be able to mint each pet individually.

### Features
- [ ] **Authentication**
    - [x] Local dev wallet (emulator)
    - [ ] Flow-compatible wallets (testnet)
- [x] **Non-fungible Token**
    - [x] Account setup
    - [x] Minting (pre-minting and user-minting)
    - [x] Withdrawing and deposit
- [ ] **Fungible Token**
    - [ ] Account setup
    - [ ] Minting
    - [ ] Withdrawing and deposit
- [ ] Storage
    - [x] Store images on NFT Storage
    - [ ] Store all metadata on NFT Storage (testnet or mainnet)

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

Dual-licensed under MIT and Apache 2. Dog and cat photos from Unsplash.
