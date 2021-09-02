import { useEffect, useRef, useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import mintPetTokens, {mintPetToken} from "flow/transactions/pets/MintPetToken.tx";
import raw from "./CheckTokenMetadata.cdc";
import raw2 from "./GetAllTokenIds.cdc";
import {ipfsToWeb2Url} from "helpers";
import Pet from "pet";

const TokenData = () => {
  const [nftInfo, setNftInfo]: [any, any] = useState(null);
  let scriptText: any = useRef();
  let scriptText2: any = useRef();
  useEffect(() => {
    let loadScript = async () => {
      let script = await fetch(raw);
      scriptText.current = await script.text();

      let script2 = await fetch(raw2);
        scriptText2.current = await script2.text()
    };
    loadScript();
  }, [scriptText, scriptText2]);

  const fetchTokenData = async () => {
    // const encoded = await fcl.send([
    //   fcl.script`${scriptText.current}`,
    //   fcl.args([fcl.arg(1, t.UInt64)]),
    // ]);
    // await mintPetTokens();
    try {
        let res = await mintPetToken({
            name: "Cat",
            age: "1",
            breed: "Tabbie",
            color: "black",
            sex: "F",
        });
        console.log('res: ', res);
    } catch(err) {
        console.log("ERR: ", err);
    }

    const encoded = await fcl.send([
        fcl.script(scriptText.current),
        fcl.args([fcl.arg(1, t.UInt64)]),
    ]);
    const decoded = await fcl.decode(encoded);
    console.log(decoded);
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
        <button
            className="button is-primary"
            onClick={async () => {
                await mintPetTokens();
                // console.log("ID", txId);
            }}
        >
            Mint Tokens
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
          {/* <div className="content">
            <img 
              alt="Dog"
              src={ipfsToWeb2Url(nftInfo.uri) || "https://bulma.io/images/placeholders/Oops!.png"}
              width="300"
            />
          </div> */}
          <button onClick={() => setNftInfo(null)} className="button is-secondary">
            Clear Token
          </button>
        </div>
      }
    </div>
  );
}

export default TokenData;