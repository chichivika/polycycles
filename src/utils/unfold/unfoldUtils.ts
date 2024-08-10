import {
    Points,
    Point,
    Segment,
    Segments
} from 'utils/drawUtils';

export type SegmentInfo = Points | null;
export type SegmentsInfo = SegmentInfo[];
export type RombCoordinates = {
    bottom: Point,
    top: Point,
    rHip: Point,
    lHip: Point
}

export type TrapezeInfo = Segments | null;
export type AllTrapezesInfo = TrapezeInfo[];
export type RombSegment = Segment | null;
export type AllRombSegments = Segments;
export type RombInfo = {
    segment: RombSegment,
    middle: boolean,
    outerSides: number[]
}
export type AllRombsInfo = RombInfo[];
export type SetInfo = {
    segments: Segments,
    areas: Points[]
};
export type EdgePath = {
    edgeIndex: number,
    hasPocket: boolean
};
export type EdgesPath = EdgePath[]
export type SpecialInfo = {
    kSet: SetInfo,
    tripleSet: SetInfo,
    edgesPath: EdgesPath
}