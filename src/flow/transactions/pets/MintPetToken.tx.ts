import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import Pet, { petToCadenceDict } from "pet";
import cadenceScript from "flow/transactions/pets/MintPetToken.cdc";
import { authz } from "./authz";
import PetStorage, { NFTStorageToken } from "storage";

const storage = new PetStorage();

export const mintPetToken = async (pet: Pet) => {
  const code = await (await fetch(cadenceScript)).text();
  const payload = fcl.args([
    fcl.arg(
      petToCadenceDict(pet),
      t.Dictionary({ key: t.String, value: t.String }),
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
  let _ = await fcl.decode(encoded);
  let petData: NFTStorageToken = await storage.upload(pet);
  return petData;
}

export default mintPetToken;