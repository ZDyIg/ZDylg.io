let font;

let timer = 0;
let timerActive = true;
let minutes = 0;
let seconds = 0;

let gameState = "start";
let ball, ballSpeedX, ballSpeedY;
let paddle1, paddle2, paddleSpeed;
let paddleWidth = 10, paddleHeight = 60;
let score1 = 0, score2 = 0;
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
  paddleSpeed = 6; // Aumento leve de velocidad
}

function draw() {
  background(gameState === "playing" ? "#a8c3d9" : "#608780");

  if (gameState === "start") screenStart();
  else if (gameState === "playing") {
    positionOnBall();
    movingPaddle();
    levelUp();
  } else if (gameState === "paused") screenPause();
  else if (gameState === "options") screenOptions();
}

function positionOnBall() {
  fill(255);
  ellipse(ball.x, ball.y, 10, 10);

  ball.x += ballSpeedX;
  ball.y += ballSpeedY;

  if (ball.y <= 0 || ball.y >= height) {
    ballSpeedY *= -1;
  }

  if (ballHitsPaddle(paddle1)) {
    ballSpeedX *= -1.1; // Aumenta levemente la velocidad en cada rebote
    ball.x = paddle1.x + paddleWidth; // Evita que se "pegue" a la paleta
  }
  if (ballHitsPaddle(paddle2)) {
    ballSpeedX *= -1.1;
    ball.x = paddle2.x - paddleWidth;
  }

  if (ball.x <= 0) {
    score2++;
    resetBall();
  } else if (ball.x >= width) {
    score1++;
    resetBall();
  }
}

function ballHitsPaddle(paddle) {
  return (
    ball.x <= paddle.x + paddleWidth &&
    ball.x >= paddle.x &&
    ball.y >= paddle.y &&
    ball.y <= paddle.y + paddleHeight
  );
}

function movingPaddle() {
  fill(255);
  rect(paddle1.x, paddle1.y, paddleWidth, paddleHeight);
  rect(paddle2.x, paddle2.y, paddleWidth, paddleHeight);

  let targetY1 = paddle1.y;
  let targetY2 = paddle2.y;

  if (keyIsDown(87) && paddle1.y > 0) targetY1 -= paddleSpeed;
  if (keyIsDown(83) && paddle1.y < height - paddleHeight) targetY1 += paddleSpeed;
  if (keyIsDown(UP_ARROW) && paddle2.y > 0) targetY2 -= paddleSpeed;
  if (keyIsDown(DOWN_ARROW) && paddle2.y < height - paddleHeight) targetY2 += paddleSpeed;

  // Interpolación para movimiento más fluido
  paddle1.y = lerp(paddle1.y, targetY1, 0.5);
  paddle2.y = lerp(paddle2.y, targetY2, 0.5);
}

function keyPressed() {
  if (keyCode === 80) {
    gameState = gameState === "playing" ? "paused" : "playing";
    gameState === "playing" ? loop() : noLoop();
  }

  if (gameState === "start") {
    if (keyCode === 32) gameState = "playing"; // SPACE para empezar
    else if (keyCode === 112) gameState = "options"; // F1 para opciones
    else if (keyCode === 27) noLoop(); // ESC para salir
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

  if (score1 >= maxScore || score2 >= maxScore) {
    noLoop();
    textSize(32);
    text("Juego terminado", width / 2, height / 2);
  }
  
  if (timerActive && frameCount % 60 === 0) {
    timer++;
    seconds = timer % 60;
    minutes = Math.floor(timer / 60);
  }
}

function resetBall() {
  ball.set(width / 2, height / 2);
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
