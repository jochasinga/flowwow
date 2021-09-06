import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import raw from "./GetAllExistingTokenIds.cdc";

async function getAllExistingTokenIds() {
    try {
        let script = await(await fetch(raw)).text();
        const encoded = await fcl.send([fcl.script(script)]);
        return await fcl.decode(encoded);
    } catch (err) {
        return { error: err };
    }
}

export default getAllExistingTokenIds;
