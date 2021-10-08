import Pet from "pet";
import data from "pets.json";
import { createContext, useReducer, useContext } from "react";
import { PropertyAccessEntityNameExpression } from "typescript";

export let pets: Pet[] = [];

export const initState = data.pets;

export const initializeState = () => initState;

export type Updater = { id: number, data: any };

export enum ActionType {
  Set,
  Update,
}

export interface Action {
  type: ActionType;
  payload?: Pet[] | Updater;
}

export function reducer(pets: Pet[], action: Action) {
  let newState;
  switch (action.type) {
    case ActionType.Set:
      newState = action.payload! as Pet[];
      break;    
    // case ActionType.Update:
    //   const petData = (action.payload as Updater).data;
    //   const id = (action.payload as Updater).id;

    //   console.log('new data: ', petData);

    //   console.log('pets before: ', pets);

    //   const newPets = pets.map((pet: Pet) => {
    //     if (pet.name === petData.name) {
    //       console.log('yes');
    //       return data;
    //     }
    //     console.log('no');
    //     console.log('pet.name: ', pet.name);
    //     console.log('data.name: ', petData.name);
    //     return pet;
    //   });

    //   console.log('pets after: ', newPets);

    //   newState = newPets;
    //   break;
    default:
      throw new Error();
  }
  console.log('newState: ', newState);
  return newState;
}

interface Context {
  state: Pet[],
  dispatch: any,
}

const PetsStateContext = createContext({
  state: initState,
  dispatch: null,
} as Context);

export const PetsStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <PetsStateContext.Provider value={{state, dispatch}}>
      {children}
    </PetsStateContext.Provider>
  )
}

export const usePetsState = () => {
  const { state, dispatch } = useContext(PetsStateContext);
  return [state, dispatch];
}
