let colors = {
    "blue": [0, 128, 150],
    "yellow": [150, 128, 0],
    "grey": [80],
    "green": [128, 150, 0],
    "purple": [150, 0, 128],
    "white": [200],
    "black": [25]
}

function createColors() {
    let _colors = {}
    for (let theColor of Object.keys(colors)) {
        _colors[theColor] = color(colors[theColor])
    }
    return _colors;
}