import transferToken from "flow/transactions/pets/TransferToken.tx";

const Card = ({ pet, user, id }: any) => {
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
              className="card-footer-item button is-dark subtitle"
              onClick={async () => {
                let txId = await transferToken(id, user?.addr);
                console.log(txId, user?.addr, " adopted ", pet.name);
              }}
            >
              <span>Adopt</span>&nbsp;
              <span>&#10084;</span>
            </button>
          </footer>
        }
      </div>
    </div>
  );
}

export default Card;