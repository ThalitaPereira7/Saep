import {Routes, Route} from 'react-router-dom';
import { CadUsuario } from '../Paginas/CadUsuario'; 
import { Quadro } from '../Componentes/Quadro';
import { Inicial } from '../Paginas/Inicial';
import { CadTarefas } from '../Paginas/CadTarefas';

export function Rotas(){
    return(
        <Routes>
            <Route path='/' element={<Inicial/>}>
                <Route index element={<Quadro/>}/>
                <Route path='cadUsuario' element={<CadUsuario/>}/>
                <Route path='cadTarefas/:id?' element={<CadTarefas />}/>
            </Route>
        </Routes>


    )
}