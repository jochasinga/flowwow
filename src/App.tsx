import React, { useEffect, useRef, useState } from 'react';
import Nav from './Nav';
// import mintPetTokens from 'flow/transactions/pets/MintPetToken.tx';
// import TokenData from 'flow/scripts/pets/TokenData';
import 'App.css';
import 'theme.scss';
import Pet from "pet";
import Card from "Card";
import getAllTokenIds from 'flow/scripts/pets/GetAllTokenIds.script';
import getTokenMetadata from 'flow/scripts/pets/GetTokenMetadata.script';
import { setSyntheticLeadingComments } from 'typescript';


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

function Tiles({ pets }: any) {
  let myPets1 = pets.slice(0, 4);
  let myPets2 = pets.slice(4);
  return (
    <section className="section mx-6">
      <div className="block">
        <div className="columns block">
          {
            myPets1.map((pet: Pet, id: number) => (
              <div className="column">
                <Card pet={pet} key={id} />
              </div>
            ))
          }
        </div>
        <div className="columns block">
          {
            myPets2.map((pet: Pet, id: number) => (
              <div className="column">
                <Card pet={pet} key={id} />
              </div>
            ))
          }
        </div>
      </div>
    </section>
  );
}


function App() {
  const [pets, setPets] = useState([]);
  const [petIds, setPetIds] = useState([]);
  useEffect(() => {
    const getIds = async () => {
      let ids = await getAllTokenIds();
      console.log("IDs: ", ids);
      setPetIds(ids);
    };
    getIds();
  }, []);

  useEffect(() => {
    // let pets: Pet[] = [];
    const getMetadata = async () => {
      let pets = petIds.map(async (id: number) => {
        let data = await getTokenMetadata(id);
        return data;
      });
      console.log("PETs: ", pets);
      let allPets = await Promise.all(pets);
      setPets(allPets as any);
    };
    getMetadata();
  }, [petIds]);

  // useEffect(() => {
  //   const getMetadata = async () => {
  //     let pets: Pet[] = [];
  //     petIds.current?.forEach(async (id: number) => {
  //       let data = await getTokenMetadata(id);
  //       pets.push(data);
  //     });
  //     console.log("PETs: ", pets);
  //     setPets(pets as any);
  //   };
  //   getMetadata();
  // }, [petIds.current]);
  return (
    <div className="App">
      <Hero />
      {/* <Nav /> */}
      {/* <TokenData /> */}
      <Tiles pets={pets} />
    </div>
  );
}

export default App;
