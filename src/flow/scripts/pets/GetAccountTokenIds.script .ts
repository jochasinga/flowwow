import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import raw from "./GetAccountTokenIds.cdc";

async function getAccountTokenIds(addr: string) {
    console.log("Address is ", addr);
    try {
        let script = await(await fetch(raw)).text();
        const encoded = await fcl.send([
            fcl.script(script),
            fcl.args([fcl.arg(addr, t.Address)])
        ]);
        return await fcl.decode(encoded);
    } catch (err) {
        return { error: err };
    }
}

export default getAccountTokenIds;
