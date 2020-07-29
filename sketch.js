let window_width = 1000;
let window_length = 500;
let step = 20;
var value = 0;
var towerCoords = [];
var walls = [];

var panX = 0
var panY = 0
var translationX = 0
var translationY = 0
var zoom = 1

const ZOOM_SENSITIVITY = 100
const PAN_SENSITIVITY = 1

function setup() {
  cnv = createCanvas(window_width, window_length);
  cnv.mouseClicked(getCoords);
  strokeWeight(0.5)

  document.getElementById("defaultCanvas0").onwheel = (event) => event.preventDefault()
  document.getElementById("defaultCanvas0").onmousewheel = (event) => event.preventDefault()
}

function draw() {  
  let highlight_orange = color(255, 204, 0);
  let neon_blue = color(80,90,255);
  let neon_orange = color(255, 153, 51);

  translate(Math.round(translationX), Math.round(translationY))
  scale(zoom)

  background(value);
  stroke(255)
  for (var i=0; i <= window_width; i+=step) {
    line(i, 0, i, window_length)
  }

  for (var j=0; j <= window_length; j+=step) {
    line(0, j, window_width, j)
  }
  var x_coord = Math.floor(mouseX / step)*step
  var y_coord = Math.floor(mouseY / step)*step
  fill(highlight_orange);
  rect(x_coord, y_coord, step, step)

  for (var i=0; i < walls.length; i++) {
    fill(neon_blue);
    rect(walls[i][0], walls[i][1], step, step)
  }
  
  if (towerCoords.length > 0) {
    fill(neon_orange);
    rect(towerCoords[0][0], towerCoords[0][1], step, step)
  }

}

function mouseWheel(event) {
  // if the deltas are decimals then it is a zoom event
  if (event.deltaX % 1 == 0 && event.deltaY % 1 == 0) {
    panX -= event.deltaX * PAN_SENSITIVITY
    panY -= event.deltaY * PAN_SENSITIVITY
  }
  else {
    zoom *= 1 - event.delta / ZOOM_SENSITIVITY
    // zoom = max(min(zoom, 2), 1)
  }

  translationX = (panX - (window_width / 2)) * zoom + (window_width / 2);
  translationY = (panY - (window_length / 2)) * zoom + (window_length / 2);
}

function getCoords() {
  let x_coord = Math.floor(mouseX / step)*step
  let y_coord = Math.floor(mouseY / step)*step
  walls.push([x_coord, y_coord])
  return false
}

function keyTyped() {
  if (key === 't' && towerCoords.length == 0) {
    let x_coord = Math.floor(mouseX / step)*step
    let y_coord = Math.floor(mouseY / step)*step
    towerCoords.push([x_coord, y_coord])
  }
  return false
}
