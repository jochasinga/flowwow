import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import Pet, {petToCadenceDict} from "pet";
import { NFTStorage, File } from "nft.storage";
import cadenceScript from "flow/transactions/pets/MintPetToken.cdc";
import {authz} from "./authz";

const client = new NFTStorage({
    token: process.env.REACT_APP_NFTSTORAGE_API_KEY!
});

const uploadToStorage = async (pet: Pet) => {
    if (pet.photo) {
        const url = await fetch(pet.photo);
        const data = await url.blob();
        const metadata = await client.store({
            ...pet,
            description: `Data of ${pet.name}`,
            image: new File([data], `${pet.name}.jpg`, { type: "image/jpg" }),
        } as any);
        return metadata;
    }
    return null;
}

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
    } catch (err) {
        console.error(err);
    }
}

export default mintPetToken;