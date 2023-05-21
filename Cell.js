const CELL_TYPES = {
    "REGULAR": 0,
    "BLOCKED": 1
}

const CELL_STATES = {
    "DEFAULT": 0,
    "HOVERED": 1,
    "ACTIVE": 2
};

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
        this.correctLetter = undefined;
        this.currentLetter = undefined;
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