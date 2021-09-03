import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import raw from "./SetupReceiverAccount.cdc";

async function setupReceiverAccount() {
    console.log("current user", fcl.currentUser());
    console.log("current authz", fcl.authz);

    console.log("setting up receiver account");

    let cdc = await(await fetch(raw)).text();
    const txId = await fcl.mutate({
        cadence: cdc,
        limit: 35,
    });
    return txId;
    // return fcl.tx(txId).onceSealed();
}

export default setupReceiverAccount;