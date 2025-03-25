import "./App.css";
import { UserContextProvider } from "./contexts/UserContext/UserContextProvider";

export default function App({ children }) {
  return (
    <UserContextProvider>
      <div className="app">{children}</div>
    </UserContextProvider>
  );
}
