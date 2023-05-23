let _colors_;

function setup() {
    let canvas = createCanvas(CANVAS_DIM, CANVAS_DIM);
    canvas.parent("canvas-container");

    _colors_ = createColors();
}

function draw() {
    background(_colors_.white);

    if (puzzle) {
        push();
        for (let cell of puzzle.cells) {
            cell.draw();
        }
        pop();
    }
}

function mouseMoved() {
    if (!puzzle)
        return false;
    let m = getMouseCoords();
    if (m.x < 0)
        return false;
    for (let cell of puzzle.cells) {
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
    if (!puzzle)
        return false;
    let m = getMouseCoords();
    if (m.x < 0)
        return false;
    for (let cell of puzzle.cells) {
        
        if (cell.state === CELL_STATES.HOVERED) {
            cell.state = CELL_STATES.ACTIVE;
            console.log(cell);
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
    if (!puzzle)
        return false;
    let moveMade = false;
    for (let i = 0; i < puzzle.cells.length; i++) {
        let cell = puzzle.cells[i];
        if (cell.state === CELL_STATES.ACTIVE) {
            switch (key) {
                case "ArrowUp": {
                    let index = i - CELL_COUNT;
                    if (index < 0)
                        index += puzzle.cells.length
                    puzzle.cells[index].state = CELL_STATES.ACTIVE;
                    cell.state = CELL_STATES.DEFAULT;
                    moveMade = true;
                    break;
                }
                case "ArrowDown": {
                    let index = i + CELL_COUNT;
                    if (index >= puzzle.cells.length)
                        index -= puzzle.cells.length;
                    puzzle.cells[index].state = CELL_STATES.ACTIVE;
                    cell.state = CELL_STATES.DEFAULT;
                    moveMade = true;
                    break;
                }
                case "ArrowLeft": {
                    let index = i - 1;
                    if (i % CELL_COUNT === 0)
                        index = i + CELL_COUNT - 1;
                    puzzle.cells[index].state = CELL_STATES.ACTIVE;
                    cell.state = CELL_STATES.DEFAULT;
                    moveMade = true;
                    break;
                }
                case "ArrowRight": {
                    let index = i + 1;
                    if (i % CELL_COUNT === CELL_COUNT - 1)
                        index = i - (CELL_COUNT - 1);
                    puzzle.cells[index].state = CELL_STATES.ACTIVE;
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