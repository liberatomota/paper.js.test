type PointType = {
    name?: string;
    x: number;
    y: number;
    draggable?: boolean;
}

type SegmentType = [PointType, PointType];

type LineType = PointType[];


export {
    PointType,
    SegmentType,
    LineType,
}

