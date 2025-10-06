import { BrowserRouter } from "react-router-dom"
import { Rotas } from "./Rotas/Rotas";

//permite a navegação na aplicação, mexendo até o endereçamento
function App() {

  return (
   <BrowserRouter>
      <Rotas/>
   </BrowserRouter>
  )
}

export default App
