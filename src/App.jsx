import React, { useEffect, useRef, useState } from 'react';
import "./styles.css";

function App() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    var canvas = canvasRef.current;
    var ctx = canvas.getContext('2d');

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    const interval = setInterval(() => {
      if (isPlaying) {
        draw(ctx, canvas);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "36px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Atari Breakout", canvas.width / 2 - 110, canvas.height / 2 + 5);
      };
    }, 10);

    return () => {
      clearInterval(interval)
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
    };

  }, [isPlaying]);

  var ballRadius = 10;
  var x = 240;
  var y = 160;
  var dx = 2;
  var dy = -2;
  var paddleHeight = 10;
  var paddleWidth = 75;
  var paddleX = 202;
  var rightPressed = false;
  var leftPressed = false;

  var brickRowCount = 3;
  var brickColumnCount = 5;
  var brickWidth = 75;
  var brickHeight = 20;
  var brickPadding = 10;
  var brickOffsetTop = 30;
  var brickOffsetLeft = 30;

  var score = 0;
  var lives = 3;
  var bricks = [];

  const keyDownHandler = (e) => {
    if (e.keyCode === 39 || e.keyCode === 68) {
      rightPressed = true;
    }
    else if (e.keyCode === 37 || e.keyCode === 65) {
      leftPressed = true;
    }
  }
  const keyUpHandler = (e) => {
    if (e.keyCode === 39 || e.keyCode === 68) {
      rightPressed = false;
    }
    else if (e.keyCode === 37 || e.keyCode === 65) {
      leftPressed = false;
    }
  }

  const drawBricks = (ctx) => {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        console.log(bricks[c][r].status);
        if (bricks[c][r].status === 1) {
          var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
          var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  };

  const drawBall = (ctx) => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx, canvas) => {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  const collisionDetection = () => {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];
        if (b.status === 1) {
          if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
            dy = -dy;
            bricks[c][r].status = 0;
            score++;
            console.log(bricks);
            if (score === brickRowCount * brickColumnCount) {
              alert("YOU WIN, CONGRATULATIONS!");
              document.location.reload();
            };
          };
        };
      };
    };
  };
  const drawScore = (ctx) => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
  }

  const drawLives = (ctx, canvas) => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
  };

  for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  };

  const draw = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks(ctx);
    drawBall(ctx);
    drawPaddle(ctx, canvas);
    collisionDetection();
    drawScore(ctx);
    drawLives(ctx, canvas);

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      }
      else {
        lives--;
        if (!lives) {
          alert("GAME OVER")
          document.location.reload();
        }
        else {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 3;
          dy = -3;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    x += dx;
    y += dy;
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "30px", fontFamily: "sans-serif" }}>
        Taller JS
      </div>
      <canvas ref={canvasRef} id="myCanvas" width="480" height="320"></canvas>
      {isPlaying ? (<>
        <div style={{ textAlign: "center" }}>
          <button onClick={() => {
            setIsPlaying(false);
          }}>Reiniciar</button>
        </div>
      </>) : (<>
        <div style={{ textAlign: "center" }}>
          <button onClick={() => {
            setIsPlaying(true);
          }}>Dale click para Jugar</button>
        </div>
      </>)}
    </div>
  );
};

export default App;
