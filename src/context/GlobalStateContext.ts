import { Dispatch, SetStateAction, createContext } from 'react';

export interface GlobalStateInterface {
  isAdminDashboardEnabled: boolean;
};

const GlobalStateContext = createContext({
  state: {} as Partial<GlobalStateInterface>,
  setState: {} as Dispatch<SetStateAction<Partial<GlobalStateInterface>>>,
});

export default GlobalStateContext;