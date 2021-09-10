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

export function toTitleCase(s: string) {
    return s.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}


export function objectsEqual(o1: any, o2: any) {
    const entries1 = Object.entries(o1);
    const entries2 = Object.entries(o2);
    if (entries1.length !== entries2.length) {
      return false;
    }
    for (let i = 0; i < entries1.length; ++i) {
      // Keys
      if (entries1[i][0] !== entries2[i][0]) {
        return false;
      }
      // Values
      if (entries1[i][1] !== entries2[i][1]) {
        return false;
      }
    }
    return true;
  }