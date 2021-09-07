import { useEffect, useState } from 'react';
import Nav from './Nav';
import 'App.css';
import 'theme.scss';
import Pet from "pet";
import Card from "Card";
import getAllTokenIds from 'flow/scripts/pets/GetAllTokenIds.script';
import getTokenMetadata from 'flow/scripts/pets/GetTokenMetadata.script';
import { setSyntheticLeadingComments } from 'typescript';
import * as fcl from "@onflow/fcl";
import { flushSync } from 'react-dom';
import getAllExistingTokenIds from 'flow/scripts/pets/GetAllExistingTokenIds.script';
import getAccountTokenIds from 'flow/scripts/pets/GetAccountTokenIds.script ';


function Hero({setActivated}: any) {
  return (
    <section className="hero is-primary is-medium">
      <div className="hero-head">
        <Nav setActivated={setActivated} />
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

function Tiles({ pets, user, isActivated }: any) {
  let myPets1 = pets.slice(0, 4);
  let myPets2 = pets.slice(4);
  let counter = 1;
  return (
    <section className="section mx-6">
      <div className="block">
        <div className="columns block">
          {
            myPets1.map((pet: Pet, id: number) => {
              const el = (
                <div className="column">
                  <Card
                    pet={pet}
                    key={counter}
                    id={counter}
                    user={user}
                    isActivated={isActivated}
                  />
                </div>
              );
              counter += 1;
              return el;
            })
          }
        </div>
        <div className="columns block">
          {
            myPets2.map((pet: Pet, id: number) => {
              const el = (
                <div className="column">
                  <Card
                    pet={pet}
                    key={counter}
                    id={counter}
                    user={user}
                    isActivated={isActivated}
                  />
                </div>
              );
              counter += 1;
              return el;
            })
          }
        </div>
      </div>
    </section>
  );
}


function App() {
  const [pets, setPets] = useState([]);
  const [petIds, setPetIds] = useState([]);
  const [user, setUser] = useState(null);
  const [isActivated, setActivated] = useState(false);
  useEffect(() => {
    fcl.currentUser().subscribe(async (user: any) => {
      setUser(user);
      if (user?.loggedIn) {
        let result = await getAccountTokenIds(user?.addr);
        console.log("result: ", result);
        if (typeof result === "object" && result?.error) {
          setActivated(false);
        } else {
          setActivated(true);
        }
      }
    });
    const getIds = async () => {
      let ids = await getAllExistingTokenIds();
      setPetIds(ids);
    };
    getIds();
  }, []);

  useEffect(() => {
    const getMetadata = async () => {
      let pets = petIds.map(async (id: number) => {
        let data = await getTokenMetadata(id);
        return data;
      });
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
      <Hero setActivated={setActivated} />
      {/* <Nav /> */}
      {/* <TokenData /> */}
      <Tiles
        pets={pets}
        user={user}
        isActivated={isActivated}
      />
    </div>
  );
}

export default App;
