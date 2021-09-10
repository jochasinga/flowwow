import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import Pet, {petToCadenceDict} from "pet";
import { NFTStorage, File } from "nft.storage";
import data from "pets.json";
import cadenceScript from "flow/transactions/pets/MintPetToken.cdc";
import {authz} from "./authz";

const client = new NFTStorage({
    // token: process.env.REACT_APP_NFTSTORAGE_API_KEY!
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDM5YzIyMUUzOTFiNDMwMzQ4NDc2NzdmMmVGZTc1ODRGNTM2ZjM4OWEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMDQ0MDM0Nzg2NiwibmFtZSI6IlBldHNob3AifQ.5i8IsZX9zbaqGFfVjhwZw6VX3IPZKQ5Xr4BLMYAM9jo"
});

const uploadToStorage = async (pet: Pet) => {
    console.log('uploading ', pet.photo);
    if (pet.photo) {
        const url = await fetch(pet.photo);
        const data = await url.blob();
        // const uri = client.storeBlob(data);
        const metadata =  await client.store({
            name:  pet.name,
            description: `Photo of ${pet.name}`,
            image: new File([data], `${pet.name}.jpg`, { type: "image/jpg" })
        });
        return metadata;
    }
}

/*
const mintPetTokens = async () => {
    const pets = data.pets;
    pets.forEach(async (pet) => {
        // const uri = await uploadToStorage(pet)
        // pet.uri = uri;
        console.log("pet: ", pet);
        const res = await mintPetToken(pet);
        console.log(res);
    });
}
*/

export const mintPetToken = async (pet: Pet) => {
    const code = await (await fetch(cadenceScript)).text();
    try {
        const payload = fcl.args([
            fcl.arg(
                petToCadenceDict(pet),
                t.Dictionary({key: t.String, value: t.String}),
            )
        ]);

        const encoded = await fcl.send([
            fcl.transaction(code),
            fcl.payer(authz),
            fcl.proposer(authz),
            fcl.authorizations([authz]),
            fcl.limit(35),
            payload,
        ])
        let txId = await fcl.decode(encoded);

        let petData: any = await uploadToStorage(pet);

        return { txId, image: { ...petData }};
        // return fcl.tx(txId).onceSealed();
    } catch (err) {
        console.error("ERRRR", err);
        return;
    }
}

export default mintPetToken;