import { SVGLineElementAttributes } from "react";
import { Points } from "./drawUtils";

export function renderPolygon(aVerts: Points, oLineAttr?: SVGLineElementAttributes<SVGLineElement>) {

    let nLength = aVerts.length;
    if (nLength < 2) return;

    let aLines: ReturnType<typeof renderLine>[] = [];

    oLineAttr = oLineAttr ? oLineAttr : {};

    for (let i = 0; i < nLength - 1; ++i) {
        aLines.push(renderLine([aVerts[i], aVerts[i+1]], oLineAttr, `${i}`));
    }

    aLines.push(renderLine([aVerts[0], aVerts[nLength - 1]],oLineAttr, `${nLength - 1}`));

    return aLines;
}
export function renderLines(aLines: Points[], oAttr?: SVGLineElementAttributes<SVGLineElement>){
    return aLines.map((aLine, i)=>{
        return renderLine(aLine, oAttr, `${i}`)
    });
}
export function renderLine(aVerts: Points, oAttr?: SVGLineElementAttributes<SVGLineElement>, sKey?: string) {
    let aF = aVerts[0];
    let aS = aVerts[1];
    let oSettings = oAttr ? oAttr : {};

    return (
        <line x1={aF[0]} y1={aF[1]} 
        x2={aS[0]} y2={aS[1]} 
        key={sKey || null}
        {...oSettings} />
    );
}