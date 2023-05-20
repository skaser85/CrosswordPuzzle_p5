const CELL_COUNT = 5;
const CANVAS_DIM = 800;

const CELL_STATES = {
    "DEFAULT": 0,
    "HOVERED": 1,
    "ACTIVE": 2
};

let _colors_;

let cells;

function setup() {
    createCanvas(CANVAS_DIM, CANVAS_DIM);

    _colors_ = createColors();
    
    let boardDim = (CANVAS_DIM * 0.95);
    let cellDim = boardDim / CELL_COUNT;
    let start = CANVAS_DIM/2-boardDim/2;

    cells = [];
    for (let dy = 0; dy < CELL_COUNT; dy++) {
        for (let dx = 0; dx < CELL_COUNT; dx++) {
            let x = dx*cellDim + start;
            let y = dy*cellDim + start;
            cells.push(new Cell(x, y, cellDim));
        }
    }
}

function draw() {
    background(_colors_.white);

    push();
    for (let cell of cells) {
        cell.draw();
    }
    pop();
}

function mouseMoved() {
    let m = getMouseCoords();
    if (m.x < 0)
        return false;
    for (let cell of cells) {
        if (cell.state === CELL_STATES.ACTIVE)
            continue;
        if (cell.mouseOver(m.x, m.y)) {
            cell.state = CELL_STATES.HOVERED;
        } else {
            if (cell.state !== CELL_STATES.DEFAULT)
                cell.state = CELL_STATES.DEFAULT;
        }
    }
    return false;
}

function mouseClicked() {
    let m = getMouseCoords();
    if (m.x < 0)
        return false;
    for (let cell of cells) {
        // this allows for multiple cells to be active at once
        // if (cell.state === CELL_STATES.ACTIVE) {
        //     if (cell.mouseOver(m.x, m.y))
        //         cell.state = CELL_STATES.HOVERED;
        // } else {
        //     if (cell.state === CELL_STATES.HOVERED) {
        //         cell.state = CELL_STATES.ACTIVE;
        //     } else {
        //         cell.state = CELL_STATES.DEFAULT;
        //     }
        // }
        
        if (cell.state === CELL_STATES.HOVERED) {
            cell.state = CELL_STATES.ACTIVE;
        } else {
            if (cell.state === CELL_STATES.ACTIVE && cell.mouseOver(m.x, m.y)) {
                cell.state = CELL_STATES.HOVERED
            } else {
                cell.state = CELL_STATES.DEFAULT;
            }
        }
    }
    return false;
}

function getMouseCoords() {
    let m = createVector(mouseX, mouseY);
    if (m.x < 0 || m.x > width || 
        m.y < 0 || m.y > height)
        m = createVector(-1, -1);
    return m;
}

class Rect {
    constructor(x, y, xDim, yDim) {
        this.width = xDim;
        this.height = yDim;
        this.top = y;
        this.right = x + xDim;
        this.bottom = y + yDim;
        this.left = x;
        this.topLeft = createVector(x, y);
        this.topRight = createVector(x + xDim, y);
        this.bottomLeft = createVector(x, y + yDim);
        this.bottomRight = createVector(x + xDim, y + yDim);
        this.center = createVector(x + x/2, y + y/2);
    }
}

class Cell {
    constructor(x, y, dim) {
        this.rect = new Rect(x, y, dim, dim);
        this.colors = {
            0: _colors_.grey,   // DEFAULT
            1: _colors_.yellow, // HOVERED
            2: _colors_.blue    // ACTIVE
        };
        this.state = CELL_STATES.DEFAULT;
    }

    mouseOver(mx, my) {
        return (this.rect.left < mx && this.rect.right > mx) &&
               (this.rect.top < my && this.rect.bottom > my);
    }

    draw() {
        push();
        noStroke();
        stroke(_colors_.white)
        fill(this.colors[this.state]);
        rect(this.rect.left, this.rect.top, this.rect.width, this.rect.height);
        pop();
    }
}