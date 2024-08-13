import {
    Points,
    Point,
    Segment,
    Segments
} from 'utils/drawUtils';

//======================================================
//Вспомогательные константы и методы для ClassUnfoldBase
//======================================================

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

//Информация о множестве для отрисовки
export type SetInfo = {
    //Сегменты для отрисовки ломаных
    segments: Segments,
    //Области для закрашивания
    areas: Points[]
};

//Информация о прохождении K-линией стороны симплекса
export type EdgePath = {
    //индекс стороны
    edgeIndex: number,
    //имеется ли карман
    hasPocket: boolean
};
//Информация о прохождении K-линией сторон симплекса
export type EdgesPath = EdgePath[]

//Объект информации для отрисовки
export type SpecialInfo = {
    //K-множество
    kSet: SetInfo,
    //Множество трехкратных циклов
    tripleSet: SetInfo,
    //Путь K-линии вдоль сторон симплекса
    edgesPath: EdgesPath
}