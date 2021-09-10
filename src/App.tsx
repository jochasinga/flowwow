import { useEffect, useState } from 'react';
import 'App.css';
import 'theme.scss';
import Hero from "Hero";
import Tiles from "Tiles";
import getTokenMetadata from 'flow/scripts/pets/GetTokenMetadata.script';
import * as fcl from "@onflow/fcl";
import getAllExistingTokenIds from 'flow/scripts/pets/GetAllExistingTokenIds.script';
import getAccountTokenIds from 'flow/scripts/pets/GetAccountTokenIds.script';
import data from "pets.json";
import Pet from "pet";

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
        if (typeof result === "object" && result?.error) {
          setActivated(false);
        } else {
          setActivated(true);
        }
      }
    });

    const getIds = async () => {
      let ids = await getAllExistingTokenIds();
      if (ids.length == 0) {
          await getPets();
          return;
      }
      setPetIds(ids);
    };

    const getPets = async () => {
        let pets = data.pets;
        setPets(pets as any);
    }

    getIds();
    // getPets();
  }, []);

//   useEffect(() => {
//     const getMetadata = async () => {
//       let pets = petIds.map(async (id: number) => {
//         let data = await getTokenMetadata(id);
//         return data;
//       });
//       let allPets = await Promise.all(pets);
//       setPets(allPets as any);
//     };
//     getMetadata();
//   }, [petIds]);

  return (
    <div className="App">
      <Hero setActivated={setActivated} />
      <Tiles
        pets={pets}
        user={user}
        isActivated={isActivated}
      />
    </div>
  );
}

export default App;
