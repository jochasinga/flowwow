import { createContext, useReducer, useContext } from "react";

export interface AppState {
  isMinting: boolean;
  isTransferring: boolean;
}

const initState: AppState = {
  isMinting: false,
  isTransferring: false,
};

export const initializeState = () => initState;

interface Context {
  state: AppState,
  dispatch: any,
}

const AppStateContext = createContext({
  state: initState,
  dispatch: null,
} as Context);

export function reducer(state: any, action: Action) {
  let newState;
  switch (action) {
    case Action.ToggleMinting:
      newState = { ...state, isMinting: !state.isMinting };
      break;    
    case Action.ToggleTransferring:
      newState = { ...state, isTransferring: !state.isTransferring };
      break;
    default:
      throw new Error();
  }
  return newState;
}

export const AppStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <AppStateContext.Provider value={{state, dispatch}}>
      {children}
    </AppStateContext.Provider>
  );
}

export enum Action {
  ToggleMinting,
  ToggleTransferring,
}

export const useAppState = () => {
  const { state, dispatch } = useContext(AppStateContext);
  return [state, dispatch];
}
