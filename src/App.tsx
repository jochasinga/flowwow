import { useEffect, useCallback, useState, useReducer } from 'react';
import 'App.css';
import 'theme.scss';
import Hero from "Hero";
import Tiles from "Tiles";
import * as fcl from "@onflow/fcl";
import getAllExistingTokenIds from 'flow/scripts/pets/GetAllExistingTokenIds.script';
import getAccountTokenIds from 'flow/scripts/pets/GetAccountTokenIds.script';
import Pet from "pet";
import {
  reducer as petsReducer,
  initializeState as initPets,
  ActionType,
  PetsStateProvider,
  usePetsState,
} from "state/pets";
import {
  reducer as appReducer,
  initializeState as initApp,
  Action as AppAction,
  AppStateProvider,
  useAppState,
} from "state/app";
import Loader from "Loader/Loader";

function Body() {
  const [{ isMinting, isTransferring }, _] = useAppState();
  const [pets, dispatch] = usePetsState();
  // const [pets, dispatch] = useReducer(petsReducer, initPets());
  const [unminted, setUnmintedPets] = useState(pets);
  const [minted, setMintedPets] = useState([]);

  const setPets = useCallback((pets: Pet[]) => {
    dispatch({
      type: ActionType.Set,
      payload: pets,
    });
  }, []);

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
        setPets(initPets());
        return;
      }
    };
    getIds();
  }, []);

  useEffect(() => {
    let minted: Pet[] = pets.filter((pet : any) => (pet?.id && pet?.id > 0) || pet?.isMinted);
    let unminted: Pet[] = pets.filter((pet : any) => pet.id === undefined || pet.id === null);

    console.log('minted: ', minted);

    console.log('unminted: ', unminted);

    setMintedPets(minted as any);
    setUnmintedPets(unminted);
  }, [pets]);
  return (
    <>
      <Loader isActive={isMinting} message="✨ Minting... ✨" />
      <Loader isActive={isTransferring} message="Transferring..." />
      <Hero setActivated={setActivated} />
      <Tiles
        pets={unminted}
        user={user}
        isActivated={isActivated}
        heading="Just Dropped 📦"
      />
      <Tiles
        pets={minted}
        user={user}
        isActivated={isActivated}
        heading="Available Now 🔥"
      />
    </>
  );
}


function App() {


  return (
    <div className="App">
      <AppStateProvider>
        <PetsStateProvider>
          <Body />
        </PetsStateProvider>
      </AppStateProvider>
    </div>
  );
}

export default App;
