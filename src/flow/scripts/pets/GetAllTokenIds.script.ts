import * as fcl from "@onflow/fcl";
import raw from "./GetAllTokenIds.cdc";

async function getAllTokenIds() {
    let script = await(await fetch(raw)).text();
    const encoded = await fcl.send([fcl.script(script)]);
    return await fcl.decode(encoded);
}

export default getAllTokenIds;
