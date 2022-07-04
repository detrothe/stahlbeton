export function testeZahl(wert) {
    wert = wert.replace(/,/g, '.');
    //console.log('Komma entfernt',wert);
    if (isNaN(wert)) {
        //window.alert("Das ist keine Zahl ");

        return 0;
    }
    return wert;
}

//------------------------------------------------------------------------------------------------


export function testNumber(wert, zeile, spalte, id) {
    wert = wert.replace(/,/g, '.');
    //console.log('Komma entfernt',wert);
    if (isNaN(wert)) {
        //window.alert("Das ist keine Zahl ");

        //const objCells = document.getElementById(id).rows.item(zeile).cells;
        //objCells.item(spalte).style.backgroundColor = "darkred";
        //objCells.item(spalte).style.color = "white";

        document.getElementById(id).rows.item(zeile).cells.item(spalte).classList.add("selected");
        return 0;
    }
    return wert;
}


export function SDuennTruss() {
    this.emodul = null
    this.Iy = null
    this.r = [1,1]
}

export function sichtbar(displayName) {

    if (displayName === 'tangens') {
        document.getElementById("tangens").style.display = "block";
    } else {
        document.getElementById("tangens").style.display = "none";
    }

    if (displayName === 'kdtabelle') {
        document.getElementById("kdTabelle").style.display = "block";
    } else {
        document.getElementById("kdTabelle").style.display = "none";
    }
    if (displayName === 'duennQ') {
        document.getElementById("knotentabelle").style.display = "block";
        document.getElementById("elementtabelle").style.display = "block";
        document.getElementById("querschnittswerte").style.display = "block";
        document.getElementById("eingabe_duennQ_top").style.display = "block";
        document.getElementById("duennQ_save_daten").style.display = "block";
        document.getElementById("spannung_mxp").style.display = "block";
        document.getElementById("spannung_mxs").style.display = "block";
        document.getElementById("normalspannung").style.display = "block";
        document.getElementById("vergleichsspannung").style.display = "block";
        document.getElementById("schubspannung").style.display = "block";
        document.getElementById("my-svg").style.display = "block";
    } else {
        document.getElementById("knotentabelle").style.display = "none";
        document.getElementById("elementtabelle").style.display = "none";
        document.getElementById("querschnittswerte").style.display = "none";
        document.getElementById("eingabe_duennQ_top").style.display = "none";
        document.getElementById("duennQ_save_daten").style.display = "none";
        document.getElementById("spannung_mxp").style.display = "none";
        document.getElementById("spannung_mxs").style.display = "none";
        document.getElementById("normalspannung").style.display = "none";
        document.getElementById("vergleichsspannung").style.display = "none";
        document.getElementById("schubspannung").style.display = "none";
        document.getElementById("my-svg").style.display = "none";
    }
}

/*
let stab = new mystruct();

stab.Iy = 10.0
*/