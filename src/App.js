import { useSelector } from "react-redux";
import "./App.css";
import Header from "./pages/header/header";
import AppRoutes from "./routes/appRoutes";

function App() {
  const { isLoggedIn } = useSelector((state) => state.user);

  return (
    <div className="allContainer">
      {isLoggedIn && <Header />}
      <div className="innerContainer">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
