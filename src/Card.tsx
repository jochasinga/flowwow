const Card = ({ pet }: any) => {
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
        <footer className="card-footer">
          <a href="#" className="card-footer-item">Adopt</a>
        </footer>
      </div>
    </div>
  );
}

export default Card;