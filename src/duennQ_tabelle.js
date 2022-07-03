
import {set_nnodes,set_nelem} from "./duennQ"
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


//----------------------------------------------------------------------------------------------
export function table_index( idTable ) {
//----------------------------------------------------------------------------------------------
    if ( idTable === 'nodeTable') {
        return 0;
    } else if ( idTable === 'elemTable') {
        return 1;
    }
    return undefined;
}


//----------------------------------------------------------------------------------------------
export function clear_Tabelle() {
//----------------------------------------------------------------------------------------------

    const tabelle = document.getElementById("nodeTable");
    let nSpalten = tabelle.rows[0].cells.length;
    for (let i = 1; i < tabelle.rows.length; i++) {
        for (let j = 1; j < nSpalten; j++) {
            tabelle.rows[i].cells[j].innerText = "";
        }
    }

    const eTabelle = document.getElementById("elemTable");
    nSpalten = eTabelle.rows[0].cells.length;
    for (let i = 1; i < eTabelle.rows.length; i++) {
        for (let j = 1; j < nSpalten; j++) {
            eTabelle.rows[i].cells[j].innerText = "";
        }
    }

}
