import { createContext, useEffect, useState, useMemo } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  // Initialize currentUser from localStorage with a fallback to null
  const initialUser = JSON.parse(localStorage.getItem('user')) || null;
  const [currentUser, setCurrentUser] = useState(initialUser);

  useEffect(() => {
    // Update localStorage whenever currentUser changes
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user'); // Clear localStorage if no user
    }
  }, [currentUser]);

  // Memoize the context value for performance optimization
  const value = useMemo(() => ({ currentUser, setCurrentUser }), [currentUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
