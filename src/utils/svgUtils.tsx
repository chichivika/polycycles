import React, { SVGLineElementAttributes } from 'react';
import { Points } from './drawUtils';

// =====================================
// Методы создания элементов svg-рисунка
// =====================================

// Нарисовать многоугольник по его вершинам
export function renderPolygon(
    verts: Points,
    polygonAttrs: SVGLineElementAttributes<SVGPolygonElement> = {},
    key?: string,
) {
    let vertsChain = '';
    verts.forEach((vert) => {
        vertsChain = vertsChain.concat(` ${vert.join(',')}`);
    });

    return <polygon key={key} points={vertsChain} {...polygonAttrs} />;
}

// Нарисовать замкнутый ломаный путь из линий
export function renderClosedPath(
    verts: Points,
    lineAttrs: SVGLineElementAttributes<SVGLineElement> = {},
) {
    const vertsLength = verts.length;
    if (vertsLength < 2) {
        return;
    }

    const lines: ReturnType<typeof renderLine>[] = [];

    for (let i = 0; i < vertsLength - 1; ++i) {
        lines.push(renderLine([verts[i], verts[i + 1]], lineAttrs, `${i}`));
    }

    lines.push(renderLine([verts[0], verts[vertsLength - 1]], lineAttrs, `${vertsLength - 1}`));

    return lines;
}

// Нарисовать несколько линий
export function renderLines(lines: Points[], lineAttrs?: SVGLineElementAttributes<SVGLineElement>) {
    return lines.map((line, i) => {
        return renderLine(line, lineAttrs, `${i}`);
    });
}

// Нарисовать одну линию
export function renderLine(
    verts: Points,
    lineAttrs: SVGLineElementAttributes<SVGLineElement> = {},
    key?: string,
) {
    if (verts.length < 2) {
        return null;
    }

    const firstVert = verts[0];
    const secondVert = verts[1];

    return (
        <line
            x1={firstVert[0]}
            y1={firstVert[1]}
            x2={secondVert[0]}
            y2={secondVert[1]}
            key={key}
            {...lineAttrs}
        />
    );
}
