import {ec as EC} from "elliptic";
import { eddsa as EdDSA } from "elliptic";
import {SHA3} from "sha3";


function hash(message: any) {
    const sha = new SHA3(256);
    sha.update(Buffer.from(message, "hex"));
    return sha.digest()
}

export function sign(privateKey: any, message: any) {
    const ec = new EC("p256");
    const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
    const pub = key.getPublic();
    const priv = key.getPrivate();

    const pubkeyHex = pub.encode("hex", false)
    console.log("expected pubkey? ", pubkeyHex === "5f5f1442afcf0c817a3b4e1ecd10c73d151aae6b6af74c0e03385fb840079c2655f4a9e200894fd40d51a27c2507a8f05695f3fba240319a8a2add1c598b5635");

    const msgHash = hash(message);
    const sig = key.sign(msgHash);
    const n = 32;
    const r = sig.r.toArrayLike(Buffer, "be", n);
    const s = sig.s.toArrayLike(Buffer, "be", n);
    const derSign = sig.toDER();

    // console.log("Verified? ", key.verify(msgHash, derSign));
    return Buffer.concat([r, s]).toString("hex");
}

export function sign2(message: any) {
    let ec = new EC("secp256k1");
    let key = ec.genKeyPair();
    const sig = key.sign(hash(message));
    return sig.toDER();
}