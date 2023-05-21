const fileInput = document.querySelector('#select-a-file input[type=file]');
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector('#select-a-file .file-name');
    fileName.textContent = fileInput.files[0].name;
  }
}

const testBtn = document.querySelector("#test");
testBtn.addEventListener("click", async e => {
  let fileData = await fetch("test.json");
  let puzzleData = await fileData.json();
  console.log(getStarts(puzzleData));
  createBoard(puzzleData);
});

const createBoard = (puzzleData) => {
    let boardDim = (CANVAS_DIM * 0.95);
    let cellDim = boardDim / puzzleData.boardSize;
    let start = CANVAS_DIM/2-boardDim/2;
    
    let startsData = getStarts(puzzleData);
    let starts = Object.keys(startsData);
    let letters = getLetters(puzzleData);
    console.log(letters);
    
    cells = [];
    for (let dy = 0; dy < puzzleData.boardSize; dy++) {
        for (let dx = 0; dx < puzzleData.boardSize; dx++) {
            let x = dx*cellDim + start;
            let y = dy*cellDim + start;
            let cell = new Cell(x, y, cellDim);
            let index = getIndexFromRowCol(dy, dx, puzzleData.boardSize);
            if (puzzleData.blocked.includes(index)) {
                cell.type = CELL_TYPES.BLOCKED;
            } else {
                if (starts.includes(index.toString())) {
                    cell.number = startsData[index];
                }
                cell.letter = letters[index];
            }
            cells.push(cell);
        }
    }
}

const getStarts = (puzzleData) => {
    let starts = {};
    for (let a of puzzleData.across) {
        if (!(a.start in starts))
            starts[a.start] = a.number;
    }
    for (let d of puzzleData.down) {
        if (!(d.start in starts))
            starts[d.start] = d.number;
    }
    return starts;
}

const getLetters = (puzzleData) => {
    let letters = [];
    for (let a of puzzleData.across) {
        letters = letters.concat(a.answer.split(""))
    }
    for (let b of puzzleData.blocked) {
        letters.splice(b, 0, "");
    }
    return letters;
}

const getRowFromIndex = (index, cellCount) => {
    return Math.floor(index / cellCount);
}
  
const getColFromIndex = (index, cellCount) => {
    return index % cellCount;
}

const getIndexFromRowCol = (row, col, cellCount) => {
    return (row * cellCount) + col;
}