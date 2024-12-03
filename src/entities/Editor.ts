
import paper from 'paper';
// @ts-ignore
import ClipperLib from 'clipper-lib';
import { Rectangle } from 'paper/dist/paper-core';

export default class Editor {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    p1: paper.Path;
    p2: paper.Path;

    scale: number = 100;

    gridSize = 100;
    grid: Map<string, paper.Item[]> = new Map();

    intersectionGroup: paper.Group = new paper.Group();
    uniteGroup: paper.Group = new paper.Group();
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = ctx;

        paper.setup(this.canvas);
        const [p1, p2] = this.setPoints();
        this.p1 = p1;
        this.p2 = p2;
        this.init();
    }

    init = () => {
        this.canvas.onresize = this.onRezize;
        this.onRezize();
        // paper.view.onFrame = this.onFrame;
        paper.view.onMouseDown = this.onMouseDown;
        const intersections = this.p2.getIntersections(this.p1);
        this.drawIntersetions(intersections);

        // this.getOffset(this.p2);


        paper.view.update();
    }

    setPoints = () => {
        const p1 = new paper.Path({
            name: 'p1',
            segments: [
                new paper.Point(100, 200),
                new paper.Point(300, 200),
                new paper.Point(300, 400),
                new paper.Point(100, 400),
            ],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: 'green',
            closed: true
        });


        const p2 = p1.clone();

        p2.translate(new paper.Point(300, 50));

        this.setItemEvents(p1);
        this.setItemEvents(p2);

        this.addItemToGrid(p1);
        this.addItemToGrid(p2);

        return [p1, p2];
    }

    onRezize = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        paper.view.viewSize = new paper.Size(this.canvas.width, this.canvas.height);
    }

    onMouseDown = (event: any) => {
        const point = event.point;
        console.log(event.target);
        if (event.target instanceof paper.View === false ||
            event.target instanceof paper.Path === true
        ) {
            return;
        }

        // const circle = new paper.Path.Circle({
        //     center: point,
        //     radius: 10,
        //     fillColor: 'black',
        //     ...this.setItemEvents()
        // });


        // paper.project.activeLayer.addChild(circle);
    }

    onItemClick = (event: any) => {
        // event.stopPropagation();
        // event.preventDefault();
        console.log(event);
    }

    onItemEnter = (event: any) => {
        console.log(event);
        event.target.strokeColor = 'red';
        event.target.strokeWidth = 5;
    }

    onItemLeave = (event: any) => {
        console.log(event);
        event.target.strokeColor = 'black';
        event.target.strokeWidth = 1;
    }

    onItemDrag = (event: any) => {
        console.log(event);
        event.stopPropagation();
        event.target.position = event.target.position.add(event.delta);


        const near = this.hasNearbyElements(event.target);
        if (near) {
            event.target.fillColor = new paper.Color('red');
        } else {
            event.target.fillColor = new paper.Color('green');
        }

        /*
        const expandedBounds = new paper.Path.Rectangle(event.target.bounds.expand(30));
        console.log(expandedBounds);

        if (expandedBounds.intersects(this.p2)) {
            this.p2.fillColor = new paper.Color('red');
            console.log('intersects!!s');
            event.target.position = event.target.position.subtract(event.delta);
        } else {
            this.p2.fillColor = new paper.Color('green');
        }

        expandedBounds.remove();
        */

        // const intersections = this.p1.getIntersections(this.p2);
        // const unite = this.p1.unite(this.p2);
        // this.drawIntersetions(intersections);
        // this.drawUnite(unite);
    }

    getGridKeys = (bounds: paper.Rectangle) => {
        const minX = Math.floor(bounds.left / this.gridSize);
        const minY = Math.floor(bounds.top / this.gridSize);
        const maxX = Math.floor(bounds.right / this.gridSize);
        const maxY = Math.floor(bounds.bottom / this.gridSize);

        const keys = [];
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                keys.push(`${x},${y}`);
            }
        }
        return keys;
    }

    // Add item to the grid
    addItemToGrid = (item: paper.Path) => {
        const keys = this.getGridKeys(item.bounds);
        for (const key of keys) {
            if (!this.grid.has(key)) {
                this.grid.set(key, []);
            }
            this.grid.get(key)?.push(item);
        }
    }

    removeItemFromGrid = (item : paper.Path) => {
        const keys = this.getGridKeys(item.bounds); // Get the grid cells the item occupies
        for (const key of keys) {
            const cellItems = this.grid.get(key);
            if (cellItems) {
                // Remove the item from the cell
                const index = cellItems.indexOf(item);
                if (index !== -1) {
                    cellItems.splice(index, 1); // Remove the item
                }
                // If the cell is empty, delete it
                if (cellItems.length === 0) {
                    this.grid.delete(key);
                }
            }
        }
    }

    // Check if an item has nearby elements
    hasNearbyElements = (item: paper.Path, radius = this.gridSize) => {
        const expandedBounds = item.bounds.expand(radius);
        const keys = this.getGridKeys(expandedBounds);

        for (const key of keys) {
            const cellItems = this.grid.get(key) || [];
            for (const other of cellItems) {
                if (other !== item && other.bounds.intersects(expandedBounds)) {
                    return true; // Nearby element found
                }
            }
        }
        return false;
    }


    drawIntersetions = (intersections: paper.CurveLocation[]) => {
        this.intersectionGroup.removeChildren();
        intersections.forEach((intersection: paper.CurveLocation) => {
            console.log(intersection.path.segments);
            const circle = new paper.Path.Circle({
                center: intersection.point,
                radius: 5,
                fillColor: 'red',
                parent: this.intersectionGroup
            })
        });
    }

    drawUnite = (unite: paper.CompoundPath | paper.PathItem | paper.Path) => {
        this.uniteGroup.removeChildren();
        unite.strokeColor = new paper.Color('green');
        unite.fillColor = new paper.Color('green');
        unite.opacity = 0.5;
        unite.parent = this.uniteGroup;
    }

    setItemEvents = (item: paper.Path) => {
        item.onMouseDown = this.onItemClick;
        item.onMouseEnter = this.onItemEnter;
        item.onMouseLeave = this.onItemLeave;
        item.onMouseDrag = this.onItemDrag;
    }

    getOffset = (path: paper.Path) => {

        const offsetGroup = new paper.Group();

        const clipperPath = path.segments.map(seg => ({
            X: Math.round(seg.point.x * this.scale),
            Y: Math.round(seg.point.y * this.scale)
        }));

        const offset = new ClipperLib.ClipperOffset();
        offset.AddPath(clipperPath, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
        const offsettedPaths: ClipperLib.Path[] = [];
        offset.Execute(offsettedPaths, 20 * this.scale);

        offsettedPaths.forEach(offsetPath => {
            const newPath = new paper.Path({
                strokeColor: 'red',
                closed: true,
                parent: offsetGroup
            });
            offsetPath.forEach((pt: ClipperLib.IntPoint) => {
                newPath.add(new paper.Point(pt.X / this.scale, pt.Y / this.scale));
            });
        });
    }

    onFrame = (event: any) => {
        // the number of times the frame event was fired:
        console.log(event.count);
        // The total amount of time passed since
        // the first frame event in seconds:
        console.log(event.time);
        // The time passed in seconds since the last frame event:
        console.log(event.delta);
    }
}