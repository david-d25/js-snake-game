"use strict";

const ROWS  = 35;
const COLS  = 35;

const LEFT  = 37;
const UP    = 38;
const RIGHT = 39;
const DOWN  = 40;

const ENTER = 13;

var canvas, ctx, trails, snakeLength, direction, lastMoveDirection, food = {};

var isPaused = true;
var pauseText = "";

window.onload = function() {
  canvas = document.getElementById('gamescreen');
  ctx = canvas.getContext('2d');
  reset();

  window.onkeydown = function(event) {
    if (event.keyCode == ENTER) {
      if (isPaused) {
        isPaused = false;
        pauseText = "PAUSED";
        return;
      }
      else
        isPaused = true;
    }
    if (
      (event.keyCode == UP && lastMoveDirection != DOWN) ||
      (event.keyCode == DOWN && lastMoveDirection != UP) ||
      (event.keyCode == LEFT && lastMoveDirection != RIGHT) ||
      (event.keyCode == RIGHT && lastMoveDirection != LEFT)
      ) direction = event.keyCode;
  }

  setInterval(loop, 50);
  spawnFood();
}

function reset() {
  trails = [{x: Math.round(COLS/2), y: Math.round(2*ROWS/3)}];
  snakeLength = 4;
  direction = UP;
  lastMoveDirection = direction;
  isPaused = true;
  pauseText = "Жмякай Enter!";
}

function loop() {
  update();
  draw();
}

function update() {
  if (isPaused) return;
  let last = trails[trails.length-1];
  let next = {x: last.x, y: last.y};
  if (direction == UP)
    next.y--;
  else if (direction == DOWN)
    next.y++;
  else if (direction == LEFT)
    next.x--;
  else if (direction == RIGHT)
    next.x++;

  if (next.x < 0) next.x = COLS-1;
  if (next.y < 0) next.y = ROWS-1;
  if (next.x >= COLS) next.x = 0;
  if (next.y >= ROWS) next.y = 0;

  if (next.x == food.x && next.y == food.y) {
    snakeLength++;
    spawnFood();
  }

  for (let a = 0; a < trails.length; a++) {
    if (trails[a].x == next.x && trails[a].y == next.y) {
      reset();
      pauseText = "Это фиаско, братан!";
    }
  }


  trails.push(next);

  if (trails.length > snakeLength)
    trails.shift();
  lastMoveDirection = direction;
}

function draw() {
  if (!isPaused) {
    ctx.fillStyle = 'lime';
    ctx.font = "4vw sans-serif";
    ctx.fillText(`Length: ${snakeLength}`, 10, 50);
  }

  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let a = 0; a < trails.length; a++) {
    ctx.fillStyle = `rgb(${Math.round(Math.sin(a/5)*127 + 128)}, ${Math.round(Math.sin(a/5 + 2)*127 + 128)}, ${Math.round(Math.sin(a/5 + 4)*127 + 128)})`;
    ctx.fillRect(
      trails[a].x*canvas.width/COLS + canvas.width/COLS*0.05,
      trails[a].y*canvas.height/ROWS + canvas.height/ROWS*0.05,
      canvas.width/COLS*0.9,
      canvas.height/ROWS*0.9
      );
  }

  ctx.fillStyle = 'orange';
  ctx.fillRect(
      food.x*canvas.width/COLS + canvas.width/COLS*0.05,
      food.y*canvas.height/ROWS + canvas.height/ROWS*0.05,
      canvas.width/COLS*0.9,
      canvas.height/ROWS*0.9
      );

  if (isPaused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `calc(100vw/${pauseText.length}) sans-serif`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(pauseText, canvas.width/2, canvas.height/2);
  }
}

function spawnFood() {
  var foodCanBePlaced = false;
  do {
    foodCanBePlaced = true;
    food.x = Math.floor(Math.random()*COLS);
    food.y = Math.floor(Math.random()*ROWS);
    for (let a = 0; a < trails.length; a++) {
      if (food.x == trails[a].x && food.y == trails[a].y) {
        foodCanBePlaced = false;
        continue;
      }
    }
  } while(!foodCanBePlaced);
}