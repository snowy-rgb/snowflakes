const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

// 공
const ball = { x: canvas.width / 2, y: 300, radius: 20 };
          // px/sec

// 눈 배열
const snows = [];
let score = 0;
let lastTime = 0;

// 눈 생성
function spawnSnow() {
  snows.push({
    x: Math.random() * canvas.width,
    y: -20,
    radius: 15,
    speed: 80 + Math.random() * 100,
    active: true
  });
}
setInterval(spawnSnow, 1500); // 1.5초마다 눈 생성

// 메인 루프
function update(dt) {
  // 공 이동 (왼→오른쪽, 끝까지 가면 다시 왼쪽)
  //ball.x += ball.speed * dt;
  //if (ball.x > canvas.width) ball.x = 0; 공 대신 눈으로 표현

  // 눈 이동
  for (let snow of snows) {
    snow.y += snow.speed * dt;          // 떨어지는 속도
    snow.x -= 100 * dt;                 // 공이 앞으로 가는 듯한 효과 (왼쪽으로 이동)
    if (snow.y > canvas.height + 30 || snow.x < -30) {
      snow.active = false;
    }
  }

  // 안 쓰는 눈 제거
  for (let i = snows.length - 1; i >= 0; i--) {
    if (!snows[i].active) snows.splice(i, 1);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 땅(경로)
  ctx.strokeStyle = "#55f";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, ball.y);
  ctx.lineTo(canvas.width, ball.y);
  ctx.stroke();

  // 공 (중앙 고정)
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  // 눈
  ctx.fillStyle = "white";
  for (let snow of snows) {
    ctx.beginPath();
    ctx.arc(snow.x, snow.y, snow.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 판정
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  for (let snow of snows) {
    const dx = ball.x - snow.x;
    const dy = ball.y - snow.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < ball.radius + snow.radius + 10) {
      snow.active = false;
      score++;
      scoreEl.textContent = score;
      break;
    }
  }
});

// 게임 루프
function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000; // 초 단위
  lastTime = timestamp;

  update(dt);
  draw();
  requestAnimationFrame(loop);
}
loop();