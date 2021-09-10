import * as fcl from "@onflow/fcl";
import raw from "./GetAllTokenIds.cdc";

async function getAllTokenIds() {
    let script = await(await fetch(raw)).text();
    const encoded = await fcl.send([fcl.script(script)]);
    const ids = await fcl.decode(encoded);
    return ids.sort((a: number, b: number) => a - b);
}

export default getAllTokenIds;
