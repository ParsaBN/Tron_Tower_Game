let window_width = 1000;
let window_length = 500;
let step = 20;
var value = 0;
var towerCoords = [];
var walls = [];



function setup() {
  cnv = createCanvas(window_width, window_length);
  cnv.mouseClicked(getCoords);
  strokeWeight(0.5)
}

function draw() {
  let highlight_orange = color(255, 204, 0);
  let neon_blue = color(80,90,255);
  let neon_orange = color(255, 153, 51);
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