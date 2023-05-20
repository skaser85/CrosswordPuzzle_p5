const BKG_COLOR = 55;

const BOARD_DIM = 5;
const CANVAS_DIM = 800;

const CELL_STATES = {
    "DEFAULT": 0,
    "HOVERED": 1,
    "ACTIVE": 2
};

let COLORS;

let boardWidth, boardHeight, cellHeight, cellWidth, startX, startY;

let cells;

function setup() {
    createCanvas(CANVAS_DIM, CANVAS_DIM);

    COLORS = {
        "blue": color(0, 128, 150),
        "yellow": color(150, 128, 0),
        "grey": color(55),
        "green": color(128, 150, 0),
        "purple": color(150, 0, 128),
        "white": color(200),
        "black": color(25)
    }

    boardWidth = (width * 0.8);
    boardHeight = (height * 0.8);
    
    startX = width/2-boardWidth/2;
    startY = height/2-boardHeight/2;
    
    cellHeight = boardHeight / BOARD_DIM;
    cellWidth =  boardWidth/ BOARD_DIM;

    cells = [];
    for (let dy = 0; dy < BOARD_DIM; dy++) {
        for (let dx = 0; dx < BOARD_DIM; dx++) {
            let x = dx*cellWidth + startX;
            let y = dy*cellHeight + startY;
            cells.push(new Cell(x, y));
        }
    }
}

function draw() {
    background(COLORS.grey);

    push();
    for (let cell of cells) {
        cell.draw();
    }
    pop();

    push();
    stroke(COLORS.white);
    for (let d = 1; d <= BOARD_DIM; d++) {
        let y = d*cellHeight + startY;
        let x = d*cellWidth + startX;
        line(startX, y, boardWidth + startX, y);
        line(x, startY, x, boardHeight + startY);
    }
    pop();

    push();
    stroke(COLORS.white);
    noFill();
    strokeWeight(3);
    rect(startX, startY, boardWidth, boardHeight);
    pop();

    // push();
    // stroke(0,255,0);
    // line(width/2, 0, width/2, height);
    // line(0, height/2, width, height/2);
    // pop();
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
            if (cell.state === CELL_STATES.ACTIVE) {
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

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.rect = {
            t: this.y,
            r: x + cellWidth,
            b: y + cellHeight,
            l: this.x
        }
        this.colors = {
            0: COLORS.grey,
            1: COLORS.yellow,
            2: COLORS.blue
        };
        this.state = CELL_STATES.DEFAULT;
    }

    mouseOver(mx, my) {
        return (this.rect.l < mx && this.rect.r > mx) &&
               (this.rect.t < my && this.rect.b > my);
    }

    draw() {
        push();
        noStroke();
        fill(this.colors[this.state]);
        rect(this.x, this.y, cellWidth, cellHeight);
        pop();
    }
}