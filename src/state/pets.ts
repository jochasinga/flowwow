import Pet from "pet";
import data from "pets.json";

export let pets: Pet[] = [];

export const initializeState = () => data.pets;

export type Updater = { id: number, data: Pet|any };

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
    case ActionType.Update:
      const {id, data} = action.payload! as Updater;
      pets[id+1] = { ...pets[id+1], ...data };
      newState = pets;
      break;
    default:
      throw new Error();
  }
  return newState;
}
