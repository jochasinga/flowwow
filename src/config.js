import {config} from "@onflow/fcl";

console.log("WALLET_DISCOVERY: ", process.env.REACT_APP_WALLET_DISCOVERY);
config()
    .put("accessNode.api", process.env.REACT_APP_ACCESS_NODE)
    .put("challenge.handshake", process.env.REACT_APP_WALLET_DISCOVERY)
    .put("0xProfile", process.env.REACT_APP_CONTRACT_PROFILE);
