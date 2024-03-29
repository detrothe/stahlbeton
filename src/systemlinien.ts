import * as d3 from "d3";

import {CTrans} from './trans.js';
import {nnodes, nelem, node, truss} from "./duennQ"
import {myScreen} from "./index";

let svg = null;
let tr = null;
let label_visible = false;
export let ymin = -50.0, zmin = -50.0, ymax = 50.0, zmax = 50.0, slmax = 0.0;

export function systemlinien(node, truss, y_s: number, z_s: number, y_M: number, z_M: number, phi: number) {

    let i: number, j: number;
    //let slmax;
    let str = "";
    let y1: number, y2: number, z1: number, z2: number, h: number, si: number, co: number

    const pts_y: number[] = Array(4);
    const pts_z: number[] = Array(4);

    if (svg !== null) {
        svg = null;
        console.log("svg=", svg)
    }
    /*
        for (i = 0; i < nelem; i++) {
            y1 = node[truss[i].nod[0]].y
            z1 = node[truss[i].nod[0]].z
            y2 = node[truss[i].nod[1]].y
            z2 = node[truss[i].nod[1]].z
            h = truss[i].dicke / 2.0
            si = truss[i].sinus
            co = truss[i].cosinus

            pts_y[0] = y1 + si * h
            pts_z[0] = z1 - co * h
            pts_y[1] = y2 + si * h
            pts_z[1] = z2 - co * h
            pts_y[2] = y2 - si * h
            pts_z[2] = z2 + co * h
            pts_y[3] = y1 - si * h
            pts_z[3] = z1 + co * h
        }
    */
    ymin = 1.e30
    zmin = 1.e30
    ymax = -1.e30
    zmax = -1.e30

    for (i = 0; i < nnodes; i++) {
        //console.log(i, y[i], z[i]);
        if (node[i].y < ymin) ymin = node[i].y;
        if (node[i].z < zmin) zmin = node[i].z;
        if (node[i].y > ymax) ymax = node[i].y;
        if (node[i].z > zmax) zmax = node[i].z;
    }

    slmax = Math.sqrt((ymax - ymin) ** 2 + (zmax - zmin) ** 2)

    console.log("MAX", slmax, ymin, ymax, zmin, zmax)

    if (tr === null) {
        tr = new CTrans(ymin, zmin, ymax, zmax)
    } else {
        tr.init(ymin, zmin, ymax, zmax);
    }

    for (let i = 0; i < nnodes; i++) {
        //str += y[i] + ',' + z[i] + ' ';
        str += Math.round(tr.yPix(node[i].y)) + ',' + Math.round(tr.zPix(node[i].z)) + ' ';
    }

    console.log("str", str)

    const sl = Math.min(ymax - ymin, zmax - zmin) / 3;

    si = Math.sin(phi) * sl;
    co = Math.cos(phi) * sl;
    const hauptachse1y = Math.round(tr.yPix(y_s - co));
    const hauptachse1z = Math.round(tr.zPix(z_s - si));
    const hauptachse2y = Math.round(tr.yPix(y_s + co));
    const hauptachse2z = Math.round(tr.zPix(z_s + si));

    si = Math.sin(phi + Math.PI / 2) * sl;
    co = Math.cos(phi + Math.PI / 2) * sl;
    const hauptachse3y = Math.round(tr.yPix(y_s - co));
    const hauptachse3z = Math.round(tr.zPix(z_s - si));
    const hauptachse4y = Math.round(tr.yPix(y_s + co));
    const hauptachse4z = Math.round(tr.zPix(z_s + si));


    document.getElementById("dataviz_area").setAttribute("width", myScreen.svgWidth + "px");
    document.getElementById("dataviz_area").setAttribute("height", myScreen.clientHeight + "px");

    svg = d3.select("#dataviz_area")

        .on("mousemove", function (event) {
            const vec = d3.pointer(event);
            const coordy = document.getElementById("cursor_coordy");
            const coordz = document.getElementById("cursor_coordz");
            //let yp = Number(vec[0]) + 10 + svgBox.getBoundingClientRect().left;
            //let zp = Number(vec[1]) - 20 + svgBox.getBoundingClientRect().top;
            const yp = event.pageX + 10;
            const zp = event.pageY - 20;
            const y = (tr.yWorld(vec[0])).toFixed(1);
            const z = (tr.zWorld(vec[1])).toFixed(1);
            //console.log("mouse move1", y );
            coordy.innerHTML = "y&#772;:" + y;
            coordz.innerHTML = "z&#772;:" + z;
            //console.log("vec", vec, vec[0], vec[1], yp, zp, event.pageX, event.pageY,"|",svgBox.getBoundingClientRect().left);
            //return tooltip.style("top", zp + "px").style("left", yp + "px");
        });


    svg.selectAll("circle").remove(); // Kreise entfernen aus früheren Berechnungen damit Tooltip funktioniert
    svg.selectAll("line").remove();
    svg.selectAll("polygon").remove();
    svg.selectAll("text").remove();
    /*
        svg.append('polygon')
            .attr('points', str)
            .attr('stroke', "dimgrey")
            .attr('fill', "lightgrey");
    */
    for (i = 0; i < nelem; i++) {

        str = ""
        for (j = 0; j < 4; j++) {
            str += Math.round(tr.yPix(truss[i].pts_y[j])) + ',' + Math.round(tr.zPix(truss[i].pts_z [j])) + ' ';
        }
        svg.append('polygon')
            .attr('points', str)
            .attr('stroke', "dimgrey")
            .attr('fill', "lightgrey");

    }


    let ys = Math.round(tr.yPix(y_s));
    let zs = Math.round(tr.zPix(z_s));
    let yM = Math.round(tr.yPix(y_M + y_s));
    let zM = Math.round(tr.zPix(z_M + z_s));

    console.log("ys,zs", ys, zs);
    console.log("sl", sl, Math.round(tr.yPix(sl / 2)));

    svg.append("line")   // Koordinatenkreuz im Ursprung, y-Richtung
        .attr("x1", Math.round(tr.yPix(0.0)))
        .attr("x2", Math.round(tr.yPix(sl / 2)))
        .attr("y1", Math.round(tr.zPix(0.0)))
        .attr("y2", Math.round(tr.zPix(0.0)))
        .attr("stroke", "darkslategrey")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow_darkslategrey)");

    svg.append("text").attr("x", Number(Math.round(tr.yPix(sl / 2))) + 5).attr("y", Number(Math.round(tr.zPix(0.0))) - 7).html("y&#772;").style("font-size", 15).style("fill", 'darkslategrey');

    svg.append("line")   // Koordinatenkreuz im Ursprung, z-Richtung
        .attr("x1", Math.round(tr.yPix(0.0)))
        .attr("x2", Math.round(tr.yPix(0.0)))
        .attr("y1", Math.round(tr.zPix(0.0)))
        .attr("y2", Math.round(tr.zPix(sl / 2)))
        .attr("stroke", "darkslategrey")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow_darkslategrey)");

    svg.append("text").attr("x", Number(Math.round(tr.yPix(0.0))) + 5).attr("y", Number(Math.round(tr.zPix(sl / 2))) - 6).html("z&#772;").style("font-size", 15).style("fill", 'darkslategrey');

// y-z Koordinatensystem

    svg.append("line")
        .attr("x1", ys)
        .attr("x2", Math.round(tr.yPix(y_s + sl / 2)))
        .attr("y1", zs)
        .attr("y2", zs)
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("marker-end", "url(#arrow_blue)");

    svg.append("text").attr("x", Number(Math.round(tr.yPix(y_s + sl / 2))) + 5).attr("y", zs - 5).text("y").style("font-size", 15).style("fill", 'blue');

    svg.append("line")
        .attr("x1", ys)
        .attr("x2", ys)
        .attr("y1", zs)
        .attr("y2", Math.round(tr.zPix(z_s + sl / 2)))
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("marker-end", "url(#arrow_blue)");

    svg.append("text").attr("x", ys + 5).attr("y", Number(Math.round(tr.zPix(z_s + sl / 2))) - 5).text("z").style("font-size", 15).style("fill", 'blue');

// Hauptachsenkoordinatensystem

    svg.append("line")
        .attr("x1", hauptachse1y)
        .attr("x2", hauptachse2y)
        .attr("y1", hauptachse1z)
        .attr("y2", hauptachse2z)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");

    svg.append("text").attr("x", Number(hauptachse2y) + 5).attr("y", Number(hauptachse2z) - 5).text(" 1").style("font-size", 15);

    svg.append("line")
        .attr("x1", hauptachse3y)
        .attr("x2", hauptachse4y)
        .attr("y1", hauptachse3z)
        .attr("y2", hauptachse4z)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");

    svg.append("text").attr("x", Number(hauptachse4y) + 5).attr("y", Number(hauptachse4z) - 5).text(" 2").style("font-size", 15);

    svg.append("circle")       // Schwerpunkt
        .attr("cx", ys).attr("cy", zs).attr("r", 5).style("fill", "blue")
        .attr("id", "circleBasicTooltip")

    console.log("yM", yM, zM, y_M, z_M)
    svg.append("circle")       // Schubmittelpunkt
        .attr("cx", yM).attr("cy", zM).attr("r", 5).style("fill", "red")
        .attr("id", "circleTooltip_SM")

// Hauptachsen


// create a tooltip
    const tooltip = d3.select("#my-svg")    // #my_dataviz   my-svg
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("z-index", "120")
        .style("width", 20)
        .text("Schwerpunkt");

    //console.log("--tooltip--", tooltip.text);

    d3.select("#circleBasicTooltip")
        .on("mouseover", function () {
            //console.log("in mouseover");
            d3.select(this)
                .style("fill", "orange");

            //console.log("tooltip",tooltip.value);
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function (event) {
            const vec = d3.pointer(event);
            const svgBox = document.getElementById("my-svg");
            //let yp = Number(vec[0]) + 10 + svgBox.getBoundingClientRect().left;
            //let zp = Number(vec[1]) - 20 + svgBox.getBoundingClientRect().top;
            const yp = ys + 10;
            const zp = zs - 25;
            //console.log("vec", vec, vec[0], vec[1], yp, zp, event.pageX, event.pageY,"|",svgBox.getBoundingClientRect().left);
            return tooltip.style("top", zp + "px").style("left", yp + "px");
        })
        .on("mouseout", function () {
            d3.select(this)
                .style("fill", "blue");
            return tooltip.style("visibility", "hidden");
        });


// create a tooltip
    const tooltip_SM = d3.select("#my-svg")    // #my_dataviz   my-svg
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("z-index", "120")
        .style("width", 20)
        .text("Schubmittelpunkt");

    //console.log("tooltip", tooltip);

    d3.select("#circleTooltip_SM")
        .on("mouseover", function () {
            //console.log("in mouseover");
            d3.select(this)
                .style("fill", "orange");

            //console.log("tooltip_SM",tooltip_SM);
            return tooltip_SM.style("visibility", "visible");
        })
        .on("mousemove", function (event) {
            const vec = d3.pointer(event);
            const svgBox = document.getElementById("my-svg");
            //let yp = Number(vec[0]) + 10 + svgBox.getBoundingClientRect().left;
            //let zp = Number(vec[1]) - 20 + svgBox.getBoundingClientRect().top;
            const yp = yM + 10; //event.pageX + 10;
            const zp = zM - 25; //event.pageY - 20;
            //console.log("vec", vec, vec[0], vec[1], yp, zp, event.pageX, event.pageY,"|",svgBox.getBoundingClientRect().left);
            return tooltip_SM.style("top", zp + "px").style("left", yp + "px");
        })
        .on("mouseout", function () {
            d3.select(this)
                .style("fill", "red");
            return tooltip_SM.style("visibility", "hidden");
        });

//svg.selectAll("circle").remove(); // alles entfernen aus früheren Berechnungen


}

export function label_svg() {
    let nod1: number, nod2: number, ym: number, zm: number;

    //console.log("in label_svg")
    if (svg !== null) {
        //console.log("svg not null")
        /*
                svg.append("text")
                    .attr("x", 100)
                    .attr("y", 100)
                    .html("test").style("font-size", 15)
                    .style("fill", 'darkslategrey');
        */
        if (label_visible === false) {

            label_visible = true

            for (let i = 0; i < nnodes; i++) {

                svg.append("text")
                    .attr("x", tr.yPix(node[i].y) + 5)
                    .attr("y", tr.zPix(node[i].z) - 10)
                    .html(String(i + 1))
                    .style("font-size", 15)
                    .style("fill", 'darkslategrey')
                    .attr("class", "label_node");

            }

            for (let i = 0; i < nelem; i++) {
                nod1 = truss[i].nod[0];
                nod2 = truss[i].nod[1];
                ym = (node[nod1].y + node[nod2].y) / 2;
                zm = (node[nod1].z + node[nod2].z) / 2;

                svg.append("text")
                    .attr("x", tr.yPix(ym) + 5)
                    .attr("y", tr.zPix(zm) - 10)
                    .html(String(i + 1))
                    .style("font-size", 15)
                    .style("fill", 'darkblue')
                    .attr("class", "label_elem");

            }
        } else {
            label_visible = false
            svg.selectAll(".label_node").remove();
            svg.selectAll(".label_elem").remove();
        }

    }
}