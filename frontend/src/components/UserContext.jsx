import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  return (
    <UserContext.Provider value={{ userData, setUserData, paymentDetails, setPaymentDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
