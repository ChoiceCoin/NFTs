import React, { useContext, useState } from "react";

const AppContext = React.createContext();
export const AppProvider = ({ children }) => {
  const [propsObj, setPropsObj] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [markdown, setMarkdown] = useState(null);
  const [title, setTitle] = useState(null)
  const [address, setAddress] = useState(null);

  return (
    <AppContext.Provider
      value={{
        propsObj,
        setPropsObj,
        isModalOpen,
        setModalOpen,
        isConnected,
        setConnected,
        markdown,
        setMarkdown,
        title,
        setTitle,
        address,
        setAddress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useGlobalContext = () => useContext(AppContext);
