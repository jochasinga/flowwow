import {ec as EC} from "elliptic";
import { eddsa as EdDSA } from "elliptic";
import {SHA3} from "sha3";


function hash(message: any) {
    const sha = new SHA3(256);
    sha.update(Buffer.from(message, "hex"));
    return sha.digest()
}

export function sign(privateKey: any, message: any) {
    const ec = new EC("secp256k1");
    const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
    const sig = key.sign(hash(message));
    const n = 32;
    const r = sig.r.toArrayLike(Buffer, "be", n);
    const s = sig.s.toArrayLike(Buffer, "be", n);
    return Buffer.concat([r, s]).toString("hex");
}

export function sign2(message: any) {
    let ec = new EC("secp256k1");
    let key = ec.genKeyPair();
    const sig = key.sign(hash(message));
    return sig.toDER();
}