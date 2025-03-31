import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { SERVER_PARAMS } from "../../constants";
import axios from "axios";

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getUserData = async () => {
    axios
      .get(SERVER_PARAMS.url + "/user/is-auth", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data.userData);
        }
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
