import { Routes, Route } from "react-router-dom";

import EnvioForm from "./pages/Envios/EnvioForm/EnvioForm";
import EnvioList from "./pages/Envios/EnviosList/EnviosList";
import "./index.css";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" Component={CadastroProduto} />
    </Routes>
    </>
  );
}


export default App;
