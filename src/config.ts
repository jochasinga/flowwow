import {config} from "@onflow/fcl";

console.log("discovery.wallet", process.env.REACT_APP_WALLET_DISCOVERY)
console.log("accessNode.api", process.env.REACT_APP_ACCESS_NODE);
config()
    .put("accessNode.api", process.env.REACT_APP_ACCESS_NODE)
    .put("discovery.wallet", process.env.REACT_APP_WALLET_DISCOVERY)
    .put("app.detail.title", process.env.REACT_APP_TITLE)
    .put("0xWowToken", process.env.REACT_APP_WOWTOKEN_CONTRACT)
    .put("0xPetShop", process.env.REACT_APP_PETSHOP_CONTRACT)
    .put("0x01", process.env.REACT_APP_EMULATOR_ACCOUNT)
    .put("0x02", process.env.REACT_APP_SECOND_ACCOUNT);
