import {NFTStorage, File} from "nft.storage";
import Pet from "pet";

// Type of the metadata returned from NFTStorage upload
export interface NFTStorageToken {
  ipnft: string,
  url: string,
  web2Url?: string,
  data: {
    description?: string,
    image?: URL,
  }
}

// Wrapper class for NFTStorage client
export default class PetStorage {
  readonly client: NFTStorage;
  readonly pet?: Pet;

  constructor(token = process.env.REACT_APP_NFTSTORAGE_API_KEY!, pet?: Pet) {
    this.client = new NFTStorage({ token });
    this.pet = pet;
  }

  async upload(pet?: Pet) {
    return await uploadToStorage(this.client, pet || this.pet!);
  }
}

/****** Unexported helper functions ********/

function cidToWeb2Url(cid: string, filename?: string) {
  return `https://${cid}.ipfs.dweb.link${filename && '/' + filename}`;
}

function ipfsToWeb2Url(ipfs: URL) {
  console.log('ipfs URL: ', ipfs);
  if (ipfs.protocol === 'ipfs:') {
    let [cid, filename] = ipfs.pathname.slice(2).split('/');
    return cidToWeb2Url(cid, filename);
  }
}

const uploadToStorage = async (client: NFTStorage, pet: Pet) => {
  let imgData;
  if (pet.photo) {
    let url = await fetch(pet.photo);
    imgData = await url.blob();
  }

  let metadata = await client.store({
      ...pet,
      description: `Data of ${pet.name}`,
      image: imgData && new File([imgData], `${pet.name}.jpg`, { type: "image/jpg" }),
  } as any);

  const result = {
    ...metadata,
    web2Url: ipfsToWeb2Url(new URL(metadata.url)),
  };
  console.log('result: ', result);
  return result;
}