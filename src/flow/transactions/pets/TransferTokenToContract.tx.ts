import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import raw from "./TransferTokenToContract.cdc";

async function transferTokenToContract(id: number) {
    let code = await(await fetch(raw)).text();
    const args = fcl.args([
        fcl.arg(id, t.UInt64),
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
        return fcl.tx(txId).onceSealed();
    } catch (err) {
        console.error(err);
    }
}

export default transferTokenToContract;