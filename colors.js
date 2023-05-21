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
    for (let theColor of Object.keys(colors)) {
        colors[theColor] = color(colors[theColor])
    }
    return colors;
}