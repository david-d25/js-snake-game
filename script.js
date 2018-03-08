"use strict";

const ROWS  = 35;
const COLS  = 35;

const LEFT  = 37;
const UP    = 38;
const RIGHT = 39;
const DOWN  = 40;

var canvas, ctx, trails, snakeLength, direction, lastMoveDirection;

window.onload = function() {
  canvas = document.getElementById('gamescreen');
  ctx = canvas.getContext('2d');
  trails = [{x: Math.round(COLS/2), y: Math.round(2*ROWS/3)}];
  snakeLength = 4;
  direction = UP;
  lastMoveDirection = direction;

  window.onkeydown = function(event) {
    if (
      (event.keyCode == UP && lastMoveDirection != DOWN) ||
      (event.keyCode == DOWN && lastMoveDirection != UP) ||
      (event.keyCode == LEFT && lastMoveDirection != RIGHT) ||
      (event.keyCode == RIGHT && lastMoveDirection != LEFT)
      ) direction = event.keyCode;
  }

  setInterval(loop, 200);
}

function loop() {
  update();
  draw();
}

function update() {
  let last = trails[trails.length-1];
  if (direction == UP)
    trails.push({x: last.x, y: last.y-1});
  else if (direction == DOWN)
    trails.push({x: last.x, y: last.y+1});
  else if (direction == LEFT)
    trails.push({x: last.x-1, y: last.y});
  else if (direction == RIGHT)
    trails.push({x: last.x+1, y: last.y});

  if (trails.length > snakeLength)
    trails.shift();
  lastMoveDirection = direction;
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'lime';
  for (let a = 0; a < trails.length; a++)
    ctx.fillRect(
      trails[a].x*canvas.width/COLS + canvas.width/COLS*0.05,
      trails[a].y*canvas.height/ROWS + canvas.height/ROWS*0.05,
      canvas.width/COLS*0.9,
      canvas.height/ROWS*0.9
      );
}