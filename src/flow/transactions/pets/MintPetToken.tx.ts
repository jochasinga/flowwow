import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import Pet, {petToCadenceDict} from "pet";
import { NFTStorage} from "nft.storage";
import data from "pets.json";
import cadenceScript from "flow/transactions/pets/MintPetToken.cdc";

const client = new NFTStorage({ token: process.env.REACT_APP_NFTSTORAGE_API_KEY! });

const uploadToStorage = async (pet: Pet) => {
    console.log('uploading ', pet.photo);
    if (pet.photo) {
        const url = await fetch(pet.photo);
        const data = await url.blob();
        const uri = client.storeBlob(data);
        const metadata =  await client.store({
            name:  pet.name,
            description: `Photo of ${pet.name}`,
            image: new File([data], `${pet.name}.jpg`, { type: "image/jpg" })
        });
        return uri;
    }
}

const mintPetTokens = async () => {
    const pets = data.pets;
    console.log("pets: ", pets);
    pets.forEach(async (pet) => {
        // const uri = await uploadToStorage(pet)
        // pet.uri = uri;
        console.log("pet: ", pet);
        const res = await mintPetToken(pet);
        console.log(res);
    });
}

export const mintPetToken = async (pet: Pet) => {
    const code = await (await fetch(cadenceScript)).text();
    try {
        // const txId = await fcl.mutate({
        //     cadence: code,
        //     args: (arg, t) => [arg(name, t.String)],
        // });
        const payload = fcl.args([
            fcl.arg(
                petToCadenceDict(pet),
                // [
                //     {key: "name", value: "Neo"},
                //     {key: "age", value: "3"},
                // ],
                t.Dictionary({key: t.String, value: t.String}),
            )
        ])

        const encoded = await fcl.send([
            fcl.transaction(code),
            fcl.payer(fcl.authz),
            fcl.proposer(fcl.authz),
            fcl.authorizations([fcl.authz]),
            fcl.limit(35),
            // fcl.args([fcl.arg(payload, t.Dictionary)]),
            payload,
        ])
        let txId = await fcl.decode(encoded);
        return txId;
        // return fcl.tx(txId).onceSealed();
    } catch (err) {
        console.error("ERRRR", err);
        return;
    }
}

export default mintPetTokens;