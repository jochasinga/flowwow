import React, { useEffect } from 'react';
import Nav from './Nav';
import mintPetTokens from 'flow/transactions/pets/MintPetToken.tx';
import TokenData from 'flow/scripts/pets/TokenData';
import 'App.css';
import 'theme.scss';

function Hero() {
  return (
    <section className="hero is-primary is-medium">
      <div className="hero-head">
        <Nav />
      </div>
      <div className="hero-body">
        <div className="container has-text-centered">
          <p className="title">
            NFT Pet Store
          </p>
          <p className="subtitle">
            Adopt these cute furballs
          </p>
        </div>
      </div>

      <div className="hero-foot">
      </div>
    </section>
  );
}


function App() {
//   useEffect(() => {
//     mintPetTokens();
//   }, []);
  return (
    <div className="App">
      <Hero />
      {/* <Nav /> */}
      <TokenData />
    </div>
  );
}

export default App;
