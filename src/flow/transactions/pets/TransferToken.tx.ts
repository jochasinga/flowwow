import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import raw from "./TransferToken.cdc";
import {authz} from "./authz";

async function transferToken(id: number, recipientAddr: string) {
    let code = await(await fetch(raw)).text();
    const args = fcl.args([
        fcl.arg(id, t.UInt64),
        fcl.arg(recipientAddr, t.Address),
    ]);

    try {
        const encoded = await fcl.send([
            fcl.transaction(code),
            fcl.payer(fcl.authz),
            fcl.proposer(authz),
            fcl.authorizations([authz]),
            fcl.limit(35),
            args,
        ]);
        let txId = await fcl.decode(encoded);
        return fcl.tx(txId).onceSealed();
    } catch (err) {
        console.error(err);
    }
}

export default transferToken;