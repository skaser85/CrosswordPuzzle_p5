const CELL_COUNT = 5;
const CANVAS_DIM = 800;

const CELL_TYPES = {
    "REGULAR": 0,
    "BLOCKED": 1
}

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
        if (cell.state === CELL_STATES.ACTIVE || cell.state === CELL_STATES.BLOCKED)
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

function keyReleased() {
    let moveMade = false;
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];
        if (cell.state === CELL_STATES.ACTIVE) {
            switch (key) {
                case "ArrowUp": {
                    let index = i - CELL_COUNT;
                    if (index < 0)
                        index += cells.length
                    cells[index].state = CELL_STATES.ACTIVE;
                    cell.state = CELL_STATES.DEFAULT;
                    moveMade = true;
                    break;
                }
                case "ArrowDown": {
                    let index = i + CELL_COUNT;
                    if (index >= cells.length)
                        index -= cells.length;
                    cells[index].state = CELL_STATES.ACTIVE;
                    cell.state = CELL_STATES.DEFAULT;
                    moveMade = true;
                    break;
                }
                case "ArrowLeft": {
                    let index = i - 1;
                    if (i % CELL_COUNT === 0)
                        index = i + CELL_COUNT - 1;
                    cells[index].state = CELL_STATES.ACTIVE;
                    cell.state = CELL_STATES.DEFAULT;
                    moveMade = true;
                    break;
                }
                case "ArrowRight": {
                    let index = i + 1;
                    if (i % CELL_COUNT === CELL_COUNT - 1)
                        index = i - (CELL_COUNT - 1);
                    cells[index].state = CELL_STATES.ACTIVE;
                    cell.state = CELL_STATES.DEFAULT;
                    moveMade = true;
                    break;
                }
            }

            // 48..57  = 0..9 on top row of keyboard
            // 96..105 = 0..9 on num pad
            // 65..90  = letters
            if ((keyCode >= 48 && keyCode <= 57) ||
                (keyCode >= 96 && keyCode <= 105)) {
                if (cell.number) {
                    if (cell.number.length === 1) {
                        cell.number += key.toString();
                    } else if (cell.number.length == 2) {
                        cell.number = key.toString();
                    }
                } else {
                    cell.number = key.toString();
                }
            } else if (keyCode >= 65 && keyCode <= 90) {
                cell.letter = key.toUpperCase();
            }

            // 8 = backspace
            if (keyCode === 8) {
                cell.letter = undefined;
            }

            // 46 = delete
            if (keyCode === 46) {
                cell.number = undefined;
            }

            // 32 = space
            if (keyCode === 32) {
                if (cell.type === CELL_TYPES.REGULAR) {
                    cell.type = CELL_TYPES.BLOCKED;
                } else if (cell.type === CELL_TYPES.BLOCKED) {
                    cell.type = CELL_TYPES.REGULAR;
                }
            }
        }
        if (moveMade)
            break;
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
        this.center = createVector(x + xDim/2, y + yDim/2);
    }
}

class Cell {
    constructor(x, y, dim) {
        this.rect = new Rect(x, y, dim, dim);
        this.colors = {
            0: _colors_.grey,   // DEFAULT
            1: _colors_.yellow, // HOVERED
            2: _colors_.blue,   // ACTIVE
        };
        this.type = CELL_TYPES.REGULAR;
        this.state = CELL_STATES.DEFAULT;
        this.number = undefined;
        this.letter = undefined;
        this.numberTextSize = 24;
        this.letterTextSize = 110;
    }

    mouseOver(mx, my) {
        return (this.rect.left < mx && this.rect.right > mx) &&
               (this.rect.top < my && this.rect.bottom > my);
    }

    draw() {
        push();
        noStroke();
        stroke(_colors_.white)
        fill(this.type === CELL_TYPES.REGULAR ? this.colors[this.state] : _colors_.black);
        rect(this.rect.left, this.rect.top, this.rect.width, this.rect.height);
        if (this.type === CELL_TYPES.BLOCKED && this.state !== CELL_STATES.DEFAULT) {
            noFill();
            stroke(this.colors[this.state]);
            strokeWeight(3);
            let pad = 2;
            rect(this.rect.left+pad, this.rect.top+pad, this.rect.width-pad*2, this.rect.height-pad*2);
        }
        if (this.letter) {
            fill(_colors_.white);
            textSize(this.letterTextSize);
            let tw = textWidth(this.letter);
            text(this.letter, this.rect.center.x - tw/2, this.rect.bottom - this.letterTextSize/6);
        }
        if (this.number) {
            fill(_colors_.white);
            textSize(this.numberTextSize);
            let tw = textWidth(this.number);
            text(this.number, this.rect.left + tw/2, this.rect.top + this.numberTextSize);
        }
        pop();
    }
}