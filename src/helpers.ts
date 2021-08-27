export function cidToWeb2Url(cid: string) {
    return `https://${cid}.ipfs.dweb.link`;
}

export function ipfsToWeb2Url(uri: string) {
    try {
        let url = new URL(uri);
        if (url.protocol === "ipfs:") {
            let cid = url.pathname.slice(2);
            return cidToWeb2Url(cid);
        }
    } catch (err) {
        return null;
    }
}
