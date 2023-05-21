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