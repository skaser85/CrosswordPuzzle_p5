const fileInput = document.querySelector('#select-a-file input[type=file]');
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector('#select-a-file .file-name');
    fileName.textContent = fileInput.files[0].name;
  }
}

const loadFileBtn = document.querySelector("#loadFile");
const saveFileBtn = document.querySelector("#saveFile");

loadFileBtn.addEventListener("click", async e => {
  let fileData = await fetch("test.json");
  let puzzleData = await fileData.json();
  puzzle = new Puzzle(puzzleData.boardSize);
  puzzle.blocked = puzzleData.blocked;
  for (let a of puzzleData.across) {
    puzzle.across.push(new Answer(a.number, a.start, a.clue, a.answer));
  }
  for (let d of puzzleData.down) {
    puzzle.down.push(new Answer(d.number, d.start, d.clue, d.answer));
  }
  puzzle.startsMap = puzzle.getStartsMap();
  puzzle.starts = Object.keys(puzzle.startsMap);
  puzzle.letters = puzzle.getLetters();
  createBoard();
});

saveFileBtn.addEventListener("click", async e => {

});

const createBoard = () => {
    let boardDim = (CANVAS_DIM * 0.95);
    let cellDim = boardDim / puzzle.boardSize;
    let start = CANVAS_DIM/2-boardDim/2;
    
    puzzle.cells = [];
    for (let dy = 0; dy < puzzle.boardSize; dy++) {
        for (let dx = 0; dx < puzzle.boardSize; dx++) {
            let x = dx*cellDim + start;
            let y = dy*cellDim + start;
            let cell = new Cell(x, y, cellDim);
            let index = getIndexFromRowCol(dy, dx, puzzle.boardSize);
            if (puzzle.blocked.includes(index)) {
                cell.type = CELL_TYPES.BLOCKED;
            } else {
                if (puzzle.starts.includes(index.toString())) {
                    cell.number = puzzle.startsMap[index];
                }
                cell.letter = puzzle.letters[index];
            }
            puzzle.cells.push(cell);
        }
    }
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