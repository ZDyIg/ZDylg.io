let font;

let timer = 0;
let timerActive = true;
let minutes = 0;
let seconds = 0;

let gameState = "start";
let ball, ballSpeedX, ballSpeedY;
let paddle1, paddle2, paddleSpeed;
let paddleWidth = 10,
  paddleHeight = 60;
let score1 = 0,
  score2 = 0;
let maxScore = 10;

function preload() {
  font = loadFont("assets/BaksoSapi.ttf");
}
function setup() {
  createCanvas(400, 400);
  textFont(font);

  ball = createVector(width / 2, height / 2);
  ballSpeedX = random([-3, 3]);
  ballSpeedY = random([-3, 3]);

  paddle1 = createVector(10, height / 2 - paddleHeight / 2);
  paddle2 = createVector(width - 20, height / 2 - paddleHeight / 2);
  paddleSpeed = 5;
}

function draw() {
  if (
    gameState === "start" ||
    gameState === "paused" ||
    gameState === "options"
  ) {
    background("#608780");
  } else {
    background("#a8c3d9");
  }

  if (gameState === "start") {
    screenStart();
  } else if (gameState === "playing") {
    positionOnBall();
    movingPaddle();
    levelUp();
  } else if (gameState === "paused") {
    screenPause();
  } else if (gameState === "options") {
    screenOptions();
  }
}

function positionOnBall() {
  fill(255);
  ellipse(ball.x, ball.y, 10, 10);

  ball.x += ballSpeedX;
  ball.y += ballSpeedY;

  if (ball.y <= 0 || ball.y >= height) {
    ballSpeedY *= -1;
  }

  if (
    ball.x <= paddle1.x + paddleWidth &&
    ball.y >= paddle1.y &&
    ball.y <= paddle1.y + paddleHeight
  ) {
    ballSpeedX *= -1;
    levelUp();
  }
  if (
    ball.x >= paddle2.x - paddleWidth &&
    ball.y >= paddle2.y &&
    ball.y <= paddle2.y + paddleHeight
  ) {
    ballSpeedX *= -1;
    levelUp();
  }

  if (ball.x <= 0) {
    score2++;
    resetBall();
  } else if (ball.x >= width) {
    score1++;
    resetBall();
  }
}

function movingPaddle() {
  fill(255);
  rect(paddle1.x, paddle1.y, paddleWidth, paddleHeight);
  rect(paddle2.x, paddle2.y, paddleWidth, paddleHeight);

  // Controles del jugador 1 (W y S)
  if (keyIsDown(87) && paddle1.y > 0) {
    paddle1.y -= paddleSpeed;
  }
  if (keyIsDown(83) && paddle1.y < height - paddleHeight) {
    paddle1.y += paddleSpeed;
  }

  // Controles del jugador 2 (Arrow Up y Down)
  if (keyIsDown(UP_ARROW) && paddle2.y > 0) {
    paddle2.y -= paddleSpeed;
  }
  if (keyIsDown(DOWN_ARROW) && paddle2.y < height - paddleHeight) {
    paddle2.y += paddleSpeed;
  }
}

function keyPressed() {
  if (keyCode === 80) {
    if (gameState === "playing") {
      gameState = "paused";
      noLoop();
    } else if (gameState === "paused") {
      gameState = "playing";
      loop();
    }
  }

  if (gameState === "start") {
    if (keyCode === 32) {
      // SPACE
      gameState = "playing";
    } else if (keyCode === 112) {
      // F1
      gameState = "options";
    } else if (keyCode === 27) {
      // ESC
      noLoop();
    }
  } else if (gameState === "options" && keyCode === 27) {
    gameState = "start";
  }
}

function levelUp() {
  fill(255);
  textSize(20);
  text(`${score1}`, width / 4, 30);
  text(`${score2}`, (3 * width) / 4, 30);

  textSize(24);
  textAlign(CENTER, CENTER);
  text(`Tiempo: ${timer}`, width / 2, 30);
  text(`${score2}`, (3 * width) / 4, 30);

  if (score1 >= maxScore || score2 >= maxScore) {
    noLoop();
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Juego terminado", width / 2, height / 2);
  }
  if (timerActive && frameCount % 60 === 0) {
    timer++;
    seconds = timer % 60;
    minutes = Math.floor(timer / 60);
  }
}

function resetBall() {
  ball = createVector(width / 2, height / 2);
  ballSpeedX = random([-3, 3]);
  ballSpeedY = random([-3, 3]);
}

function screenStart() {
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Pinpong", width / 2, height / 3);

  textSize(16);
  text("Start", width / 2, height / 2);
  text("Opciones", width / 2, height / 2 + 30);
  text("Salir", width / 2, height / 2 + 60);
  text("Zulidany Ignacio Sanchez", width / 2, height / 2 + 90);
  text("Nedel Enrique Ayon Camacho", width / 2, height / 2 + 120);
}

function screenOptions() {
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Opciones", width / 2, height / 3);
  textSize(16);
  text("Jugador 1: W y S para mover la raqueta", width / 2, height / 2);
  text("Jugador 2: Flechas para mover la raqueta", width / 2, height / 2 + 30);
  text("Presiona ESC para regresar", width / 2, height / 2 + 60);
}

function screenPause() {
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("JUEGO EN PAUSA", width / 2, height / 2);
}
