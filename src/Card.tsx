import { useState, useEffect, useCallback } from "react";
import transferToken from "flow/transactions/pets/TransferToken.tx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faTimes, faStore, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import getTokenOwner from "flow/scripts/pets/GetTokenOwner.script";
import * as fcl from "@onflow/fcl";
import getAccountTokenIds from "flow/scripts/pets/GetAccountTokenIds.script";
import Tippy from "@tippyjs/react";
import transferTokenToContract from "flow/transactions/pets/TransferTokenToContract.tx";
import Pet from "pet";
import mintPetToken from "flow/transactions/pets/MintPetToken.tx";
import Loader from "Loader/Loader";
import "./Card.scss";
import { toTitleCase, objectsEqual } from "helpers";
import getTokenMetadata from "flow/scripts/pets/GetTokenMetadata.script";
import getAllTokenIds from "flow/scripts/pets/GetAllTokenIds.script";

interface CardProps {
  pet: Pet,
  user: any,
  id: number,
  isActivated: boolean,
  isMinted?: boolean,
}

const Card = ({ pet, user, id, isActivated }: CardProps) => {
  let [currentUser, setUser] = useState(user);
  let [ownerAddress, setOwnerAddress] = useState(null);
  let [isMinted, setMinted] = useState(false);
  let [isMinting, setMinting] = useState(false);
  let [isTransferring, setTransferring] = useState(false);
  let [tokenId, setTokenId] = useState(0);

  const setNFTOwnerOf = async (id: number) => {
    let addr: string | any = await getTokenOwner(id);
    if (addr?.error) {
      setMinted(false);
      setOwnerAddress("Not Minted" as any);
    } else {
      setMinted(true);
      setOwnerAddress(addr);
    }
  };

  const masterAccount = process.env.REACT_APP_EMULATOR_ACCOUNT;
  useEffect(() => {
    setNFTOwnerOf(id)
    fcl.currentUser().subscribe(setUser);
  }, []);

  const isMatchingTokenId = useCallback(async (id: number, metadata: Pet) => {
    let data = await getTokenMetadata(id);
    const matched = objectsEqual(data as Pet, metadata);
    return matched;
  }, [id, pet]);

  return (
    <div className="card">
      <Loader isActive={isMinting} message="✨ Minting... ✨" />
      <Loader isActive={isTransferring} message="Transferring..." />
      <header className="card-header">
        <p className="card-header-title subtitle is-centered">
          {pet.name}
        </p>
      </header>
      <div className="card-image">
        <figure className="image is-4by4">
          <img src={pet.uri || pet.photo} alt="Pet image" />
        </figure>
      </div>
      <div className="card-content is-flex" style={{ flexDirection: "column" }}>
        <div className="level">
          <div className="tags has-addons level-item has-text-centered">
            {user?.loggedIn ? (
              <>
                <span className={
                  `tag is-rounded is-medium
                    ${ownerAddress === currentUser?.addr && "is-primary is-light"}`
                }>
                  <FontAwesomeIcon
                    icon={ownerAddress === masterAccount
                      ? faStore
                      : ownerAddress === "Not Minted"
                        ? faBoxOpen
                        : faWallet
                    }
                    size="1x"
                  />
                  <span className="ml-2 has-text-weight-bold">Owner</span>
                </span>

                <Tippy
                  className="floating"
                  content={ownerAddress === currentUser?.addr
                    ? "This is your account"
                    : ownerAddress === masterAccount
                      ? "This is the marketplace's account"
                      : ownerAddress === "Not Minted"
                        ? "Be the first to mint"
                        : "This is another user's account"
                  }
                  placement="top"
                  theme="light"
                  inertia
                >
                  <span className={
                    `tag is-rounded is-medium has-text-weight-medium
                      ${ownerAddress === currentUser?.addr ? "is-primary" : "is-info"}`
                  }>{ownerAddress}</span>
                </Tippy>
              </>
            ) : (
              <>
                <span className="tag is-rounded is-medium">
                  <FontAwesomeIcon icon={
                    ownerAddress === masterAccount
                      ? faStore
                      : ownerAddress == "Not Minted"
                        ? faBoxOpen
                        : faWallet
                  } size="1x" />
                  <span className="ml-2 has-text-weight-bold">Owner</span>
                </span>
                <Tippy
                  className="floating"
                  content={ownerAddress === currentUser?.addr
                    ? "This is your account"
                    : ownerAddress === masterAccount
                      ? "This is the marketplace's account"
                      : ownerAddress === "Not Minted"
                        ? "Be the first to mint"
                        : "This is another user's account"
                  }
                  placement="top"
                  theme="light"
                  inertia
                >
                  <span className="tag is-rounded is-info is-medium has-text-weight-medium">
                    {ownerAddress}
                  </span>
                </Tippy>
              </>
            )
            }
          </div>
        </div>
        <table className="table is-striped is-full-width">
          <thead>
            <tr>
              <th>Fields</th>
              <th>Characteristics</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(pet).map((k, i) => {
              if (!["photo", "uri"].includes(k)) {
                return (
                  <tr key={i}>
                    <td>{toTitleCase(k)}</td>
                    <td>{toTitleCase((pet as any)[k])}</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>

        {user?.loggedIn &&
          <footer className="card-footer cta-container">
            {isActivated ? (
              <button
                disabled={
                  ownerAddress !== user.addr
                  && ownerAddress !== masterAccount
                  && ownerAddress !== "Not Minted"
                }
                className={
                  `card-footer-item button subtitle
                  ${ownerAddress === user.addr ? "is-info" : "is-dark"}
                  ${ownerAddress === "Not Minted" && "mint-button"}`
                }
                onClick={ownerAddress !== user.addr ?
                  (async () => {
                    if (isMinted && tokenId !== null) {
                      setTransferring(true);
                      let txId = await transferToken(tokenId, user?.addr);
                      console.log(txId, user?.addr, " adopted ", pet.name);
                      setOwnerAddress(user.addr);
                      setTransferring(false)
                    } else {
                      setMinting(true);
                      const data = await mintPetToken(pet);
                      let masterTokenIds = await getAllTokenIds();
                      masterTokenIds.forEach(async (id: number) => {
                        let matched = await isMatchingTokenId(id, pet);
                        if (matched) {
                          setTokenId(id);
                        }
                      });
                      setOwnerAddress(masterAccount as any);
                      setMinting(false);
                      setMinted(true);
                    }
                  }) : (
                    async () => {
                      setTransferring(true);
                      let txId = await transferTokenToContract(tokenId);
                      console.log(txId, "transferred ", tokenId, " to ", masterAccount);
                      setOwnerAddress(masterAccount as any);
                      setTransferring(false);
                    })
                }
              >
                {ownerAddress !== user.addr
                  && ownerAddress !== masterAccount
                  && ownerAddress !== "Not Minted"
                  ? <span>Not Available</span>
                  : <span>{
                    ownerAddress === currentUser?.addr
                      ? "Release 👋"
                      : ownerAddress === "Not Minted"
                        ? "Mint ✨"
                        : "Adopt ❤️"
                  }</span>
                }
              </button>
            ) : (
              <button
                disabled
                className="card-footer-item button is-info subtitle"
              >
                <span className="block">
                  <FontAwesomeIcon icon={faTimes} size="1x"></FontAwesomeIcon>
                </span>&nbsp;Wallet Not Activated
              </button>
            )
            }
          </footer>
        }
      </div>
    </div>
  );
}

export default Card;