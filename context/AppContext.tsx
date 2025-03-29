import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

interface AppContextTypes {
  openSidebar: boolean;
  setOpenSidebar: Dispatch<SetStateAction<boolean>>;
  uiReady: boolean;
  setUiReady: Dispatch<SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextTypes>({
  openSidebar: false,
  setOpenSidebar: () => { },
  uiReady: false,
  setUiReady: () => { },
});

const AppContextProvider = ({ children }: any) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [uiReady, setUiReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUiReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider
      value={{
        openSidebar,
        setOpenSidebar,
        uiReady,
        setUiReady,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

export const useAppContext = () => useContext(AppContext);
