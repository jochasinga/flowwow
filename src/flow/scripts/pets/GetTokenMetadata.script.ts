import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import raw from "./CheckTokenMetadata.cdc";

async function getTokenMetadata(id: number) {
    let script = await(await fetch(raw)).text();
    const encoded = await fcl.send([
        fcl.script(script),
        fcl.args([fcl.arg(id, t.UInt64)]),
    ]);
    return await fcl.decode(encoded);
}

export default getTokenMetadata;
