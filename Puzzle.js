class Puzzle {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.blocked = [];
        this.across = [];
        this.down = [];
        this.startsMap = {};
        this.starts = [];
        this.letters = [];
        this.cells = [];
    }

    getStartsMap() {
        let starts = {};
        for (let a of this.across) {
            if (!(a.start in starts))
                starts[a.start] = a.number;
        }
        for (let d of this.down) {
            if (!(d.start in starts))
                starts[d.start] = d.number;
        }
        return starts;
    }

    getLetters() {
        let letters = [];
        for (let a of this.across) {
            letters = letters.concat(a.answer.split(""))
        }
        for (let b of this.blocked) {
            letters.splice(b, 0, "");
        }
        return letters;
    }
}

class Answer {
    constructor(number, start, clue, answer) {
        this.number = number;
        this.start = start;
        this.clue = clue;
        this.answer = answer;
    }
}