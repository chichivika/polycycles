import { Point, Points, Segment } from '../drawUtils';

// =======================================================
// Вспомогательные константы и методы для ClassSimplexBase
// =======================================================

export type SimplexVertInfo = {
    point: Point;
    inKSet: boolean;
};
export type SimplexVertsInfo = SimplexVertInfo[];

export type SimplexEdgeInfo = {
    points: Segment;
    inKSet: boolean;
};
export type SimplexEdgesInfo = SimplexEdgeInfo[];

export type SimplexKSetAreasInfo = Points[];
export type SimplexTripleSegment = Points;
