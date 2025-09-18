import { Routes, Route } from "react-router-dom";

import CadastroProduto from "./pages/CadastroProduto/CadastroProduto";
import TelaListagem from "./pages/TelaListagem/TelaListagem";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" Component={CadastroProduto} />
      <Route path="/listagem" Component={TelaListagem} />
    </Routes>
    </>
  );
}


export default App;
