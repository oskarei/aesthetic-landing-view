
import React, { useEffect, useRef } from 'react';

const PingPong = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreboardRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef<number>(0);
  
  useEffect(() => {
    if (!canvasRef.current || !scoreboardRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const scoreboard = scoreboardRef.current;
    
    if (!ctx) return;

    const paddleWidth = 5;
    const paddleHeight = 30;
    const ballSize = 5;

    let leftPaddleY = 45;
    let rightPaddleY = 45;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 2;
    let ballSpeedY = 2;

    let playerScore = 0;
    let aiScore = 0;

    function drawRect(x: number, y: number, w: number, h: number, color: string) {
      if (!ctx) return;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }

    function drawMiddleLine() {
      if (!ctx) return;
      ctx.strokeStyle = "black";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function draw() {
      drawRect(0, 0, canvas.width, canvas.height, "#fff");
      drawMiddleLine();
      drawRect(0, leftPaddleY, paddleWidth, paddleHeight, "black");
      drawRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, "black");
      drawRect(ballX, ballY, ballSize, ballSize, "black");
    }

    function update() {
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      if (ballY <= 0 || ballY + ballSize >= canvas.height) ballSpeedY *= -1;

      if (
        (ballX <= paddleWidth && ballY + ballSize > leftPaddleY && ballY < leftPaddleY + paddleHeight) ||
        (ballX + ballSize >= canvas.width - paddleWidth && ballY + ballSize > rightPaddleY && ballY < rightPaddleY + paddleHeight)
      ) {
        ballSpeedX *= -1;
      }

      if (ballX < 0) {
        aiScore++;
        resetBall();
      } else if (ballX > canvas.width) {
        playerScore++;
        resetBall();
      }

      if (rightPaddleY + paddleHeight / 2 < ballY) rightPaddleY += 1.2;
      else rightPaddleY -= 1.2;

      updateScoreboard();
    }

    function resetBall() {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = -ballSpeedX;
    }

    function updateScoreboard() {
      scoreboard.textContent = `You: ${playerScore} | Óskar: ${aiScore}`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        leftPaddleY = Math.max(0, leftPaddleY - 5);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        leftPaddleY = Math.min(canvas.height - paddleHeight, leftPaddleY + 5);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    function gameLoop() {
      update();
      draw();
      requestIdRef.current = requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    gameLoop();

    // Clean up
    return () => {
      cancelAnimationFrame(requestIdRef.current);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-8">
      <div ref={scoreboardRef} className="mb-2 text-sm">You: 0 | Óskar: 0</div>
      <canvas 
        ref={canvasRef} 
        width={240} 
        height={120} 
        className="border-2 border-black bg-white"
      />
      <p className="text-xs mt-2 text-muted-foreground">Use ↑ and ↓ arrow keys to play</p>
    </div>
  );
};

export default PingPong;
