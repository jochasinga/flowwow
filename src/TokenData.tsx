import { useEffect, useRef, useState } from "react";
import * as fcl from "@onflow/fcl";
import raw from "./cadence/scripts/CheckTokenMetadata.cdc";
import {ipfsToWeb2Url} from "./helpers";

const TokenData = () => {
  const [nftInfo, setNftInfo]: [any, any] = useState(null);
  let scriptText: any = useRef();
  useEffect(() => {
    let loadScript = async () => {
      let script = await fetch(raw);
      scriptText.current = await script.text();
    };
    loadScript();
  }, [scriptText]);

  const fetchTokenData = async () => {
    const encoded = await fcl.send([
      fcl.script`${scriptText.current}`
    ]);
    const decoded = await fcl.decode(encoded);
    setNftInfo(decoded);
  };

  return (
    <div className="token-data">
      <div className="center">
        <button
          className="button is-primary"
          onClick={fetchTokenData}
        >
          Fetch Token Data
        </button>
      </div>
      {
        nftInfo &&
        <div>
          {
            Object.keys(nftInfo).map((k, i) => (
              <p key={i}>{k}: {nftInfo[k]}</p>
            ))
          }
          <div className="content">
            <img 
              alt="Dog" 
              src={ipfsToWeb2Url(nftInfo.uri) || "https://bulma.io/images/placeholders/Oops!.png"}
              width="300"
            />
          </div>
          <button onClick={() => setNftInfo(null)} className="button is-secondary">
            Clear Token
          </button>
        </div>
      }
    </div>
  );
}

export default TokenData;