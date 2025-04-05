import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  const getUserData = async () => {
    const serverUrl = import.meta.env.VITE_SERVER_API_URL;
    axios
      .get(serverUrl + "/user/is-auth", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data.userData);
        }
      })
      .catch(() => {
        setUser(null);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
