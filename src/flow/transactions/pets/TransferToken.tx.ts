import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import raw from "./TransferToken.cdc";

async function transferToken(id: number, recipientAddr: string) {
    console.log("addr: ", recipientAddr);
    let code = await(await fetch(raw)).text();
    const args = fcl.args([
        fcl.arg(id, t.UInt64),
        fcl.arg(recipientAddr, t.Address),
    ]);

    try {
        const encoded = await fcl.send([
            fcl.transaction(code),
            fcl.payer(fcl.authz),
            fcl.proposer(fcl.authz),
            fcl.authorizations([fcl.authz]),
            fcl.limit(35),
            args,
        ]);
        let txId = await fcl.decode(encoded);
        return txId;
    } catch (err) {
        console.error(err);
    }
}

export default transferToken;