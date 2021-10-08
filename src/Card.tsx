import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faTimes, faStore, faBoxOpen } from "@fortawesome/free-solid-svg-icons";

import * as fcl from "@onflow/fcl";
import Tippy from "@tippyjs/react";

import getAccountTokenIds from "flow/scripts/pets/GetAccountTokenIds.script";
import mintPetToken from "flow/transactions/pets/MintPetToken.tx";
import transferTokenToContract from "flow/transactions/pets/TransferTokenToContract.tx";
import transferToken from "flow/transactions/pets/TransferToken.tx";
import getTokenOwner from "flow/scripts/pets/GetTokenOwner.script";
import getTokenMetadata from "flow/scripts/pets/GetTokenMetadata.script";
import getAllTokenIds from "flow/scripts/pets/GetAllTokenIds.script";
import getAllExistingTokenIds from "flow/scripts/pets/GetAllExistingTokenIds.script";
import { ipfsToWeb2Url } from "helpers";
import { NFTStorageToken } from "storage";

import "./Card.scss";
import Pet from "pet";
import Loader from "Loader/Loader";
import { toTitleCase, objectsEqual } from "helpers";
import { Action as AppAction, useAppState } from "state/app";
import App from "App";
import { ActionType as PetActionType, usePetsState } from "state/pets";

interface CardProps {
  pet: Pet,
  user: any,
  id: number,
  isActivated: boolean,
  isMinted?: boolean,
  empty?: boolean,
}

const Header = ({ name }: { name: string }) => (
  <header className="card-header">
    <p className="card-header-title subtitle is-centered">
      {name}
    </p>
  </header>
);

const Photo = ({ src }: { src: string }) => (
  <div className="card-image">
    <figure className="image is-4by4">
      <img src={src} alt="Pet image" />
    </figure>
  </div>
);

const Table = ({ pet }: { pet: Pet }) => (
  <table className="table is-striped is-fullwidth">
    <thead>
      <tr className="is-size-7">
        <th>Fields</th>
        <th>Characteristics</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(pet).map((k, i) => {
        if (["age", "breed", "kind", "sex", "name", "photo", "color"].includes(k)) {
          return (
            <tr key={i} className="is-size-7">
              <td>{toTitleCase(k)!}</td>
              <td>{toTitleCase((pet as any)[k]! as string)}</td>
            </tr>
          );
        }
      })}
    </tbody>
  </table>
);

const Card = ({ pet, user, id, isActivated, empty }: CardProps) => {
  const [_appState, appDispatch] = useAppState();
  let [_userState, setUser] = useState(user);
  // The scoped pet state so we can update it internally.
  // let [_pet, _setPet] = useState(pet);

  let [_pets, petDispatch] = usePetsState();

  let updatePet = (id: number, data: Pet | any) => {
    const payload = { id, data };
    console.log('payload: ', payload);
    const newPets = _pets.map((pet: Pet) => {
      if (pet.name === data?.name) {
        return data;
      }
      return pet;
    });

    console.log('newPets :', newPets);
    // petDispatch({
    //   type: PetActionType.Update,
    //   payload,
    // });
    petDispatch({
      type: PetActionType.Set,
      payload: newPets,
    });
  };


  let [ownerAddress, setOwnerAddress] = useState(null);
  let [isMinted, setMinted] = useState(false);
  let [tokenId, setTokenId] = useState(0);

  let toggleMinting = () => appDispatch(AppAction.ToggleMinting);
  let toggleTransferring = () => appDispatch(AppAction.ToggleTransferring);

  const masterAccount = process.env.REACT_APP_EMULATOR_ACCOUNT!;
  const currentUserIsOwner = () => ownerAddress == user?.addr;
  const storeIsOwner = () => ownerAddress === masterAccount;
  const notMinted = () => ownerAddress === "Not Minted"

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

  useEffect(() => {
    setNFTOwnerOf(id)
    fcl.currentUser().subscribe(setUser);
  }, []);

  const isMatchingTokenId = useCallback(async (id: number, metadata: Pet) => {
    let data = await getTokenMetadata(id);
    const matched = objectsEqual(data as Pet, metadata);
    return matched;
  }, [id, pet]);

  return !empty ? (
    <div className="card">
      <Header name={pet.name} />
      <Photo src={pet.uri || pet.photo!} />

      <div 
        className="card-content is-flex" 
        style={{ flexDirection: "column" }}
      >
        <div className="level">
          <div className="tags has-addons level-item has-text-centered">
            {user?.loggedIn ? (
              <>
                <span className={
                  `tag is-rounded is-small
                    ${currentUserIsOwner() && "is-primary is-light"}`
                }>
                  <FontAwesomeIcon
                    icon={storeIsOwner()
                      ? faStore
                      : notMinted()
                        ? faBoxOpen
                        : faWallet
                    }
                    size="1x"
                  />
                  <span className="ml-2 has-text-weight-bold">Owner</span>
                </span>

                <Tippy
                  className="floating"
                  content={currentUserIsOwner()
                    ? "This is your account"
                    : storeIsOwner()
                      ? "This is the marketplace's account"
                      : notMinted()
                        ? "Be the first to mint"
                        : "This is another user's account"
                  }
                  placement="top"
                  theme="light"
                  inertia
                >
                  <span className={
                    `tag is-rounded is-small has-text-weight-medium
                      ${currentUserIsOwner() ? "is-primary" : "is-info"}`
                  }>{ownerAddress}</span>
                </Tippy>
              </>
            ) : (
              <>
                <span className="tag is-rounded is-small">
                  <FontAwesomeIcon icon={
                    storeIsOwner()
                      ? faStore
                      : notMinted()
                        ? faBoxOpen
                        : faWallet
                  } size="1x" />
                  <span className="ml-2 has-text-weight-bold">Owner</span>
                </span>
                <Tippy
                  className="floating"
                  content={currentUserIsOwner()
                    ? "This is your account"
                    : storeIsOwner()
                      ? "This is the marketplace's account"
                      : notMinted()
                        ? "Be the first to mint"
                        : "This is another user's account"
                  }
                  placement="top"
                  theme="light"
                  inertia
                >
                  <span className="tag is-rounded is-info is-small has-text-weight-medium">
                    {ownerAddress}
                  </span>
                </Tippy>
              </>
            )
            }
          </div>
        </div>
        <div className="level">
          <Table pet={pet} />
        </div>


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
                  ${notMinted() && "mint-button"}`
                }
                onClick={ownerAddress !== user.addr ?
                  (async () => {
                    if (isMinted && tokenId !== null) {
                      // setTransferring(true);
                      toggleTransferring();
                      let _ = await transferToken(tokenId, user?.addr);
                      setOwnerAddress(user.addr);
                      // setTransferring(false)
                      toggleTransferring();
                    } else {
                      toggleMinting();
                      try {
                        const currentTokenIds = await getAllExistingTokenIds();
                        const data: NFTStorageToken = await mintPetToken(pet);
                        const newTokenIds = await getAllExistingTokenIds();
                        if (newTokenIds.length <= currentTokenIds.length) {
                          throw new Error("New token IDs cannot be equal or less than previous token IDs");
                        }

                        const latestTokenId = newTokenIds.pop();

                        // After upload, fetch the data from IPFS and use it on the
                        // UI instead of the one from the filesystem.
                        let ipfsPetData = await (await fetch(data.web2Url!)).json();
                        console.log('ipfsPetData: ', ipfsPetData);

                        let web2ImageUrl = ipfsToWeb2Url(ipfsPetData.image);

                        console.log('web2ImageUrl: ', web2ImageUrl);
                        const newPet = {
                          ...ipfsPetData,
                          id: latestTokenId,
                          photo: web2ImageUrl,
                          isMinted: true,
                          ownerAddress: null,
                        };

                        console.log('newPet: ', newPet);

                        updatePet(latestTokenId, newPet);
                        // _setPet({
                        //   ...ipfsPetData,
                        //   id: latestTokenId,
                        //   photo: web2ImageUrl,
                        //   isMinted: true,
                        //   ownerAddress: null,
                        // });
                      } catch (err) {
                        console.error(err);
                      }

                      let masterTokenIds = await getAllTokenIds();
                      masterTokenIds.forEach(async (id: number) => {
                        let matched = await isMatchingTokenId(id, pet);
                        if (matched) {
                          setTokenId(id);
                        }
                      });
                      setOwnerAddress(masterAccount as any);
                      // setMinting(false);
                      toggleMinting();
                      setMinted(true);
                    }
                  }) : (
                    async () => {
                      // setTransferring(true);
                      toggleTransferring();
                      let txId = await transferTokenToContract(tokenId);
                      console.log(txId, "transferred ", tokenId, " to ", masterAccount);
                      setOwnerAddress(masterAccount as any);
                      // setTransferring(false);
                      toggleTransferring();
                    })
                }
              >
                {ownerAddress !== user.addr
                  && ownerAddress !== masterAccount
                  && ownerAddress !== "Not Minted"
                  ? <span>Not Available</span>
                  : <span>{
                    currentUserIsOwner()
                      ? "Release 👋"
                      : notMinted()
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
  ) : (
    <div className="card">
      <p className="subtitle">Nothing to see here</p>
    </div>
  );
}

export default Card;