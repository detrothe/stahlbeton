
import {set_nnodes,set_nelem} from "./duennQ.js"
import {resize_Tabelle} from "./base_tabelle";





//----------------------------------------------------------------------------------------------
export function resizeTable() {
//----------------------------------------------------------------------------------------------

    //neq = document.getElementById("input_neq").value;
    //nlf = document.getElementById("input_nLF").value;

    let nnodes = Number(document.getElementById("input_nodes").value);

    let nelem = Number(document.getElementById("input_nelem").value);

    console.log("nnodes,nelem", nnodes, nelem)

    set_nnodes( nnodes)
    set_nelem( nelem)

    resize_Tabelle("nodeTable", nnodes, 2);
    resize_Tabelle("elemTable", nelem, 5);

}