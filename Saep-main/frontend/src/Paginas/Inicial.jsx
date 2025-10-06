import { Outlet } from "react-router-dom";
import { BarraNavegacao } from "../Componentes/BarraNavegacao";
import { Cabecalho } from "../Componentes/Cabecalho";


export function Inicial (){
    return(
        <>
            <BarraNavegacao/>
            <Cabecalho/>
            <Outlet/>
        </>
    )
}