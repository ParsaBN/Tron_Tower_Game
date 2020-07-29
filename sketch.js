let window_width = 1000;
let window_length = 500;
let step = 20;
var value = 0;


var towerCoords = [];
var tower_coin_count = 0;
let tower_center_x;
let tower_center_y;
var tower_triangle_coords;
var tower_triangle_display = false;

var walls = [];
let bits = 50;
let username = 'Flynn';
let userLevel = 26;
let diskImg;

var panX = 0
var panY = 0
var translationX = 0
var translationY = 0
var zoom = 1

const ZOOM_SENSITIVITY = 100
const PAN_SENSITIVITY = 1

function setup() {
  cnv = createCanvas(window_width, window_length);
  cnv.mouseClicked(checkCoords);

  document.getElementById("defaultCanvas0").onwheel = (event) => event.preventDefault()
  document.getElementById("defaultCanvas0").onmousewheel = (event) => event.preventDefault()
}

function draw() {
  var tower_triangle = towerCoords > 0 ? triangle(tower_triangle_coords[0], tower_triangle_coords[1], tower_triangle_coords[2], tower_triangle_coords[3], tower_triangle_coords[4], tower_triangle_coords[5]) : null;
  let highlight_orange = color(255, 204, 0);
  let neon_blue = color(80,90,255);
  let neon_orange = color(255, 153, 51);
  let light_blue = color(111, 255, 232);

  translate(Math.round(translationX), Math.round(translationY))
  scale(zoom)

  background(value);
  strokeWeight(0.5)
  stroke(255)
  for (var i=0; i <= window_width; i+=step) {
    line(i, 0, i, window_length)
  }

  for (var j=0; j <= window_length; j+=step) {
    line(0, j, window_width, j)
  }

  if (towerCoords.length > 0) {
    fill(neon_orange);
    rect(towerCoords[0][0], towerCoords[0][1], step, step)
  }

  for (var i=0; i < walls.length; i++) {
    fill(neon_blue);
    rect(walls[i][0], walls[i][1], step, step)
  }

  var x_coord = Math.floor(mouseX / step)*step
  var y_coord = Math.floor(mouseY / step)*step
  fill(highlight_orange);

  if (towerCoords.length <= 0) {
    rect(x_coord, y_coord, step, step)
  } else {
    if (tower_triangle_display === false) {
      rect(x_coord, y_coord, step, step)
    } else {
      if (trianCollision(mouseX, mouseY, tower_triangle_coords[0], tower_triangle_coords[1], tower_triangle_coords[2], tower_triangle_coords[3], tower_triangle_coords[4], tower_triangle_coords[5]) === false) {
        rect(x_coord, y_coord, step, step)
      } else {
        strokeWeight(4);
        stroke(247, 255, 0);
        triangle(tower_triangle_coords[0], tower_triangle_coords[1], tower_triangle_coords[2], tower_triangle_coords[3], tower_triangle_coords[4], tower_triangle_coords[5]);
        strokeWeight(0.5)
        stroke(255)
      }
    }
  }
  
  
  if (tower_coin_count > 0) {
    tower_triangle_display = true;
    fill(78, 255, 179)
    stroke(light_blue)
    triangle(tower_triangle_coords[0], tower_triangle_coords[1], tower_triangle_coords[2], tower_triangle_coords[3], tower_triangle_coords[4], tower_triangle_coords[5])
  }

  fill(0);
  stroke(255);
  strokeWeight(2);
  rect(750, 10, 240, 100)
  strokeWeight(0.7);
  textSize(16);
  fill(light_blue);
  textStyle(NORMAL);
  text('User : ' + username, 770, 35);
  text('Bits : ' + bits, 770, 65);
  text('Level : ' + userLevel, 770, 95);
  textSize(32);
  textStyle(BOLDITALIC);
  text('Disc \n  Wars', 875, 50)

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

function checkCoords() {
  let x_coord = Math.floor(mouseX / step)*step
  let y_coord = Math.floor(mouseY / step)*step
  if (towerCoords.length <= 0) {
    walls.push([x_coord, y_coord])
  } else if (tower_triangle_display === false || trianCollision(mouseX, mouseY, tower_triangle_coords[0], tower_triangle_coords[1], tower_triangle_coords[2], tower_triangle_coords[3], tower_triangle_coords[4], tower_triangle_coords[5]) === false) {
    walls.push([x_coord, y_coord])
  } else if (trianCollision(mouseX, mouseY, tower_triangle_coords[0], tower_triangle_coords[1], tower_triangle_coords[2], tower_triangle_coords[3], tower_triangle_coords[4], tower_triangle_coords[5])) {
    //click event for triangle
  }
  return false
}

function keyTyped() {
  if (key === 't' && towerCoords.length == 0) {
    let x_coord = Math.floor(mouseX / step)*step
    let y_coord = Math.floor(mouseY / step)*step
    towerCoords.push([x_coord, y_coord])
    tower_center_x = towerCoords[0][0] + (step / 2);
    tower_center_y = towerCoords[0][1] + (step / 2);
    tower_triangle_coords = [tower_center_x, tower_center_y, tower_center_x-15, tower_center_y-25, tower_center_x+15, tower_center_y-25];
  } else if (key === 'b') {
    let tower_x = towerCoords[0][0];
    let tower_y = towerCoords[0][1];
    tower_coin_count += 1;
  }
  return false
}

function trianCollision(px, py, x1, y1, x2, y2, x3, y3) {

  // get the area of the triangle
  var areaOrig = floor(abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)));
  //console.log("totalArea: " + areaOrig);

  // get the area of 3 triangles made between the point and the corners of the triangle
  var area1 = floor(abs((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py)));
  var area2 = floor(abs((x2 - px) * (y3 - py) - (x3 - px) * (y2 - py)));
  var area3 = floor(abs((x3 - px) * (y1 - py) - (x1 - px) * (y3 - py)));
  //console.log("areaSum: " + (area1 + area2 + area3));

  // if the sum of the three areas equals the original, we're inside the triangle
  if (area1 + area2 + area3 <= areaOrig) {
    return true;
  }
  return false;
}
