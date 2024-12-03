import { PointType, SegmentType } from "../types/line-type";

export const getLength = (p1: PointType, p2: PointType) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

export const getSquarePoints = ([p1, p2]: SegmentType, direction = "up") => {
    // Calculate the vector from p1 to p2
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    // Calculate the length of the segment between p1 and p2
    const length = getLength(p1, p2);;

    // Normalize the direction vector (unit vector)
    const unitX = dx / length;
    const unitY = dy / length;

    // Rotate the unit vector 90 degrees to get the perpendicular direction
    const perpX = direction === "up" ? -unitY : unitY;
    const perpY = direction === "up" ? unitX : -unitX;

    // Calculate p3 and p4
    const p3x = p2.x + perpX * length;
    const p3y = p2.y + perpY * length;
    const p4x = p1.x + perpX * length;
    const p4y = p1.y + perpY * length;

    // Return the points as an array
    return [
        { x: p1.x, y: p1.y }, // Point 1
        { x: p2.x, y: p2.y }, // Point 2
        { x: p4x, y: p4y }, // Point 3
        { x: p3x, y: p3y }  // Point 4
    ];
}

