import { useState } from "react";
import transferToken from "flow/transactions/pets/TransferToken.tx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faWallet } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import getTokenOwner from "flow/scripts/pets/GetTokenOwner.script";
import * as fcl from "@onflow/fcl";
import getAccountTokenIds from "flow/scripts/pets/GetAccountTokenIds.script ";
import getAllTokenIds from "flow/scripts/pets/GetAllTokenIds.script";

const Card = ({ pet, user, id }: any) => {
  let [currentUser, setUser] = useState(user);
  let [ownerAddress, setOwnerAddress] = useState(null);
  let [ownerIsCurrentUser, setOwnerIsCurrentUser] = useState(false);
  let [ownerIsContract, setOwnerIsContract] = useState(true);
  const masterAccount = process.env.REACT_APP_EMULATOR_ACCOUNT;
  useEffect(() => {
    const getNFTOwner = async (id: number) => {
      let addr = await getTokenOwner(id);
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
    getNFTOwner(id);

    fcl.currentUser().subscribe(setUser);
  }, []);

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title subtitle is-centered">
          {pet.name}
        </p>
      </header>
      <div className="card-image">
        <figure className="image is-4by4">
          <img src={pet.uri} alt="Pet image" />
        </figure>
      </div>
      <div className="card-content is-flex" style={{flexDirection: "column"}}>
        <div className="block">
          { user?.loggedIn ?
              <span className={`tag is-rounded is-medium ${ownerAddress === currentUser?.addr && "is-primary"}`}>
                  <FontAwesomeIcon icon={faWallet} size="1x" />
                  <span>&nbsp;{
                    ownerAddress === currentUser?.addr
                      ? `${ownerAddress} (You)`
                      : ownerAddress
                  }</span>
              </span>
            : <span className={`tag is-rounded is-medium`}>
                <FontAwesomeIcon icon={faWallet} size="1x" />
                <span>&nbsp;{ownerAddress}</span>
              </span>
          }
        </div>
        <table className="table is-striped is-full-width">
          <thead>
            <tr>
              <th>Attributes</th>
              <th>Values</th>
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
        { user?.loggedIn &&
          <footer className="card-footer">
            <button
              disabled={
                ownerAddress !== user.addr &&
                ownerAddress !== masterAccount
              }
              className="card-footer-item button is-dark subtitle"
              onClick={async () => {
                let txId = await transferToken(id, user?.addr);
                console.log(txId, user?.addr, " adopted ", pet.name);
                setOwnerIsCurrentUser(true);
              }}
            >
              { ownerAddress !== user.addr && ownerAddress !== masterAccount ?
                <span>Not Available</span> :
                <span>{ownerAddress === currentUser?.addr ? "Donate 👋" : "Adopt ❤️"}</span>
              }
            </button>
          </footer>
        }
      </div>
    </div>
  );
}

export default Card;