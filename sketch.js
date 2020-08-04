
let window_width = 1000;
let window_length = 500;
let step = 20;
var value = 0;

let user_tower;
let opponents_towers = []; // I dunno if this shuold be here or if it'll be in the server side code, but won't need it anytime soon

var walls = [];
let bits = 0;
let username = 'Flynn';
let userLevel = 26;
let bits_img;


var panX = 0
var panY = 0
var translationX = 0
var translationY = 0
var zoom = 1
zoom = 0.99

const ZOOM_SENSITIVITY = 100
const PAN_SENSITIVITY = 0.9

function setup() {
  cnv = createCanvas(window_width, window_length);
  cnv.mouseClicked(checkCoords);

  document.getElementById("defaultCanvas0").onwheel = (event) => event.preventDefault()
  document.getElementById("defaultCanvas0").onmousewheel = (event) => event.preventDefault()
}

function draw() {
  let highlight_orange = color(255, 204, 0);
  let neon_blue = color(80,90,255);
  let neon_orange = color(255, 153, 51);
  let light_blue = color(111, 255, 232);

  push()
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

  if (user_tower) {
    fill(neon_orange);
    rect(user_tower.towerCoords[0], user_tower.towerCoords[1], step, step)
  }

  for (var i=0; i < walls.length; i++) {
    fill(neon_blue);
    rect(walls[i][0], walls[i][1], step, step)
  }

  var worldMousePositionX = mouseX / zoom - translationX / zoom
  var worldMousePositionY = mouseY / zoom - translationY / zoom

  var x_coord = Math.floor(worldMousePositionX / step)*step
  var y_coord = Math.floor(worldMousePositionY / step)*step
  fill(highlight_orange);

  if (!user_tower) {
    rect(x_coord, y_coord, step, step)
  } else {
    if (!user_tower.triangleDisplay) {
      rect(x_coord, y_coord, step, step)
    } else {
      if (trianCollision(worldMousePositionX, worldMousePositionY, user_tower.towerTriangleCoords[0], user_tower.towerTriangleCoords[1], user_tower.towerTriangleCoords[2], user_tower.towerTriangleCoords[3], user_tower.towerTriangleCoords[4], user_tower.towerTriangleCoords[5]) === false) {
        rect(x_coord, y_coord, step, step)
      } else {
        strokeWeight(4);
        stroke(247, 255, 0);
        triangle(user_tower.towerTriangleCoords[0], user_tower.towerTriangleCoords[1], user_tower.towerTriangleCoords[2], user_tower.towerTriangleCoords[3], user_tower.towerTriangleCoords[4], user_tower.towerTriangleCoords[5]);
        strokeWeight(0.5)
        stroke(255)
      }
    }
  }
  
  
  if (user_tower && user_tower.triangleDisplay === true) {
    fill(78, 255, 179)
    stroke(light_blue)
    triangle(user_tower.towerTriangleCoords[0], user_tower.towerTriangleCoords[1], user_tower.towerTriangleCoords[2], user_tower.towerTriangleCoords[3], user_tower.towerTriangleCoords[4], user_tower.towerTriangleCoords[5])
  }

  pop();
  // UI menu
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
    panX -= event.deltaX * PAN_SENSITIVITY / zoom
    panY -= event.deltaY * PAN_SENSITIVITY / zoom
  }
  else {
    zoom *= 1 - event.delta / ZOOM_SENSITIVITY
    zoom = max(min(zoom, 2), 1)
  }

  translationX = (panX - (window_width / 2)) * zoom + (window_width / 2);
  translationY = (panY - (window_length / 2)) * zoom + (window_length / 2);
}

function checkCoords() {
  var worldMousePositionX = mouseX / zoom - translationX / zoom
  var worldMousePositionY = mouseY / zoom - translationY / zoom

  let x_coord = Math.floor(worldMousePositionX / step)*step
  let y_coord = Math.floor(worldMousePositionY / step)*step
  if (!user_tower) {
    walls.push([x_coord, y_coord])
  } else if (user_tower.triangleDisplay === false || trianCollision(worldMousePositionX, worldMousePositionY, user_tower.towerTriangleCoords[0], user_tower.towerTriangleCoords[1], user_tower.towerTriangleCoords[2], user_tower.towerTriangleCoords[3], user_tower.towerTriangleCoords[4], user_tower.towerTriangleCoords[5]) === false) {
    walls.push([x_coord, y_coord])
  } else if (trianCollision(worldMousePositionX, worldMousePositionY, user_tower.towerTriangleCoords[0], user_tower.towerTriangleCoords[1], user_tower.towerTriangleCoords[2], user_tower.towerTriangleCoords[3], user_tower.towerTriangleCoords[4], user_tower.towerTriangleCoords[5])) {
    //click event for triangle
    bits += user_tower.towerCoinCount;
    user_tower.triangleDisplay = false
    user_tower.towerCoinCount = 0
    console.log("collecting bits")
  }
  return false
}

function keyTyped() {
  var worldMousePositionX = mouseX / zoom - translationX / zoom
  var worldMousePositionY = mouseY / zoom - translationY / zoom
  if (key === 't' && !user_tower) {
    let x_coord = Math.floor(worldMousePositionX / step)*step
    let y_coord = Math.floor(worldMousePositionY / step)*step
    let tower_center_x = x_coord + (step / 2);
    let tower_center_y = y_coord + (step / 2);
    user_tower = new Tower(username, [x_coord, y_coord], [tower_center_x, tower_center_y, tower_center_x-15, tower_center_y-25, tower_center_x+15, tower_center_y-25], false, 0)
  }
  return false
} 


(function tower_bit_generation(){
  if (user_tower) {
    user_tower.towerCoinCount += 1
    user_tower.triangleDisplay = true
  }
  setTimeout(tower_bit_generation, 10000);
})();






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
