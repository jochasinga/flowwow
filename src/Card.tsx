import { useState, useCallback } from "react";
import transferToken from "flow/transactions/pets/TransferToken.tx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faTimes, faStore, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import getTokenOwner from "flow/scripts/pets/GetTokenOwner.script";
import * as fcl from "@onflow/fcl";
import getAccountTokenIds from "flow/scripts/pets/GetAccountTokenIds.script ";
import Tippy from "@tippyjs/react";
import transferTokenToContract from "flow/transactions/pets/TransferTokenToContract.tx";
import Pet from "pet";
import mintPetToken from "flow/transactions/pets/MintPetToken.tx";
import Loader from "Loader/Loader";
import "./Card.scss";

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
  let [ownerIsCurrentUser, setOwnerIsCurrentUser] = useState(false);
  let [ownerIsContract, setOwnerIsContract] = useState(true);
  let [isMinted, setMinted] = useState(false);
  let [isMinting, setMinting] = useState(false);

  const getNFTOwner = async (id: number) => {
    console.log("getNFTOwner");
    let addr: string | any = await getTokenOwner(id);
    console.log(addr, " owns NFT ", id);
    if (addr?.error) {
      setMinted(false);
      setOwnerAddress("Not Minted" as any);
    } else {
      setMinted(true);
      setOwnerAddress(addr);
      const tokenIds = await getAccountTokenIds(addr);
      if (currentUser?.addr === ownerAddress) {
        setOwnerIsCurrentUser(true);
      } else if (currentUser?.addr == masterAccount) {
        setOwnerIsContract(true);
      } else {
        setOwnerIsCurrentUser(false);
      }
    }
  };

  const masterAccount = process.env.REACT_APP_EMULATOR_ACCOUNT;
  useEffect(() => {
    getNFTOwner(id)

    fcl.currentUser().subscribe(setUser);
  }, []);

  // useEffect(() => {

  // }, [ownerAddress]);

  return (
    <div className="card">
      <Loader isActive={isMinting} message="✨ Minting... ✨" />
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
                    icon={ ownerAddress === masterAccount 
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
            <tr>
              <td>Kind</td>
              <td>{pet.kind}</td>
            </tr>
            <tr>
              <td>Age</td>
              <td>{pet.age}</td>
            </tr>
            <tr>
              <td>Sex</td>
              <td>{pet.sex}</td>
            </tr>
            <tr>
              <td>Color</td>
              <td>{pet.color}</td>
            </tr>
            <tr>
              <td>Breed</td>
              <td>{pet.breed}</td>
            </tr>
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
                    if (isMinted) {
                      let txId = await transferToken(id, user?.addr);
                      console.log(txId, user?.addr, " adopted ", pet.name);
                      setOwnerAddress(user.addr);
                    } else {
                      setMinting(true);
                      const data = await mintPetToken(pet);
                      setOwnerIsContract(true);
                      setOwnerAddress(masterAccount as any);
                      setMinting(false);
                    }
                  }) : (
                    async () => {
                      let txId = await transferTokenToContract(id);
                      console.log(txId, "transferred ", id, " to ", masterAccount);
                      setOwnerAddress(masterAccount as any);
                    }
                  )
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