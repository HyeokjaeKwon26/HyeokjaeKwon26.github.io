/**
 * CLI Retro Mini-Games Engine & Leaderboard
 * Extracted from script.js for clean modular architecture
 */

window.CLI_GAMES_LOADED = true;

/* Leaderboard System */
function getLeaderboard(gameKey) {
  const defaults = {
    snake: [
      { name: 'Dr. Kwon 👑', score: 150 },
      { name: 'KAIST CS Alum 🎓', score: 120 },
      { name: 'MGH Fellow 🏥', score: 90 },
      { name: 'CNU Med Student 🩺', score: 60 },
      { name: 'Visitor 🚀', score: 30 }
    ],
    pacman: [
      { name: 'Dr. Kwon 👑', score: 250 },
      { name: 'KAIST CS Alum 🎓', score: 180 },
      { name: 'MGH Fellow 🏥', score: 140 },
      { name: 'CNU Med Student 🩺', score: 90 },
      { name: 'Visitor 🚀', score: 40 }
    ],
    guess: [
      { name: 'Dr. Kwon 👑', score: 1 },
      { name: 'KAIST CS Alum 🎓', score: 2 },
      { name: 'MGH Fellow 🏥', score: 3 },
      { name: 'CNU Med Student 🩺', score: 5 },
      { name: 'Visitor 🚀', score: 7 }
    ]
  };

  try {
    const saved = localStorage.getItem(`cli_lb_${gameKey}`);
    return saved ? JSON.parse(saved) : defaults[gameKey] || [];
  } catch (e) {
    return defaults[gameKey] || [];
  }
}

function saveLeaderboard(gameKey, list) {
  try {
    localStorage.setItem(`cli_lb_${gameKey}`, JSON.stringify(list));
  } catch (e) {}
}

function recordScore(gameKey, name, score, isLowerBetter = false) {
  let lb = getLeaderboard(gameKey);
  lb.push({ name: name || 'Player', score: score });
  if (isLowerBetter) {
    lb.sort((a, b) => a.score - b.score);
  } else {
    lb.sort((a, b) => b.score - a.score);
  }
  lb = lb.slice(0, 5);
  saveLeaderboard(gameKey, lb);
  return lb;
}

function renderLeaderboardHTML(gameKey, highlightScore = null) {
  const lb = getLeaderboard(gameKey);
  let title = '🏆 Hall of Fame';
  if (gameKey === 'snake') title = '🐍 Snake Game Hall of Fame';
  else if (gameKey === 'guess') title = '🎯 Number Guess Hall of Fame';
  else if (gameKey === 'pacman') title = '🟡 Pac-Man Hall of Fame';

  const unit = gameKey === 'guess' ? 'tries' : 'pts';
  const badges = ['🥇 1st', '🥈 2nd', '🥉 3rd', '4th', '5th'];

  let html = `
    <div class="cli-lb-container">
      <div class="cli-lb-title">🏆 ${title} (TOP 5)</div>
  `;

  lb.forEach((item, idx) => {
    const isHighlight = highlightScore !== null && item.score === highlightScore;
    html += `
      <div class="cli-lb-row ${isHighlight ? 'highlight' : ''}">
        <span>${badges[idx]} <span class="cli-lb-name">${typeof escapeHTML === 'function' ? escapeHTML(item.name) : item.name}</span></span>
        <span class="cli-lb-score">${item.score} ${unit}</span>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

function saveLocalGameLog(gameName, detail) {
  try {
    let logs = JSON.parse(localStorage.getItem('cli_game_logs') || '[]');
    const now = new Date();
    const timeStr = `${now.getMonth()+1}/${now.getDate()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    logs.unshift({ game: gameName, detail: detail, time: timeStr });
    if (logs.length > 20) logs = logs.slice(0, 20);
    localStorage.setItem('cli_game_logs', JSON.stringify(logs));
  } catch (e) {}
}

function getLocalGameLogs() {
  try {
    return JSON.parse(localStorage.getItem('cli_game_logs') || '[]');
  } catch (e) {
    return [];
  }
}

/* CLI Mini Games Implementation */
let currentSnakeLoop = null;

function startSnakeGame(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  if (currentSnakeLoop) clearInterval(currentSnakeLoop);

  if (typeof logAnalyticsEvent === 'function') {
    logAnalyticsEvent('cli_game_start', { game_name: 'snake' });
  }
  saveLocalGameLog('Snake Game', 'Game Started');

  mount.innerHTML = `
    <div class="cli-game-container">
      <div class="cli-game-header">
        <span>🐍 Retro Snake Game</span>
        <span>Score: <span id="snake-score">0</span></span>
      </div>
      <canvas id="snake-canvas" width="240" height="160" class="cli-snake-canvas"></canvas>
      <div class="cli-game-controls">
        <button class="cli-game-btn" id="snake-btn-up">▲</button>
      </div>
      <div class="cli-game-controls">
        <button class="cli-game-btn" id="snake-btn-left">◄</button>
        <button class="cli-game-btn" id="snake-btn-down">▼</button>
        <button class="cli-game-btn" id="snake-btn-right">►</button>
        <button class="cli-game-btn" id="snake-restart-btn" style="background:#0284c7; color:#fff; border-color:#38bdf8;">🔄 Restart</button>
      </div>
    </div>
  `;

  const canvas = document.getElementById('snake-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const gridSize = 10;
  const tileCountX = canvas.width / gridSize;
  const tileCountY = canvas.height / gridSize;

  let snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
  let food = { x: 15, y: 8 };
  let dx = 1;
  let dy = 0;
  let score = 0;
  let gameOver = false;

  function placeFood() {
    food = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY)
    };
  }

  function handleDirection(dir) {
    if (dir === 'UP' && dy === 0) { dx = 0; dy = -1; }
    if (dir === 'DOWN' && dy === 0) { dx = 0; dy = 1; }
    if (dir === 'LEFT' && dx === 0) { dx = -1; dy = 0; }
    if (dir === 'RIGHT' && dx === 0) { dx = 1; dy = 0; }
  }

  document.getElementById('snake-btn-up').onclick = () => handleDirection('UP');
  document.getElementById('snake-btn-down').onclick = () => handleDirection('DOWN');
  document.getElementById('snake-btn-left').onclick = () => handleDirection('LEFT');
  document.getElementById('snake-btn-right').onclick = () => handleDirection('RIGHT');
  document.getElementById('snake-restart-btn').onclick = () => startSnakeGame(mountId);

  const keyHandler = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') handleDirection('UP');
    if (e.key === 'ArrowDown' || e.key === 's') handleDirection('DOWN');
    if (e.key === 'ArrowLeft' || e.key === 'a') handleDirection('LEFT');
    if (e.key === 'ArrowRight' || e.key === 'd') handleDirection('RIGHT');
  };
  document.addEventListener('keydown', keyHandler);

  function draw() {
    if (gameOver) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
      endGame();
      return;
    }

    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        endGame();
        return;
      }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      const scoreEl = document.getElementById('snake-score');
      if (scoreEl) scoreEl.innerText = score;
      placeFood();
    } else {
      snake.pop();
    }

    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);

    ctx.fillStyle = '#34d399';
    for (let i = 0; i < snake.length; i++) {
      ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 1, gridSize - 1);
    }
  }

  function endGame() {
    gameOver = true;
    clearInterval(currentSnakeLoop);
    document.removeEventListener('keydown', keyHandler);
    if (typeof logAnalyticsEvent === 'function') {
      logAnalyticsEvent('cli_game_over', { game_name: 'snake', score: score });
    }
    saveLocalGameLog('Snake Game', `Score: ${score}`);
    recordScore('snake', 'Player', score);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '12px monospace';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 15);

    const gameContainer = mount.querySelector('.cli-game-container');
    if (gameContainer && !gameContainer.querySelector('.cli-lb-container')) {
      const lbDiv = document.createElement('div');
      lbDiv.innerHTML = `
        <div style="text-align:center; margin:10px 0;">
          <button class="cli-game-btn" id="snake-gameover-restart-btn" style="background:#2563eb; color:#fff; padding:8px 16px; font-size:0.9rem; font-weight:bold; width:100%; box-shadow:0 0 10px rgba(37,99,235,0.4);">🎮 Play Again / Restart 🔄</button>
        </div>
      ` + renderLeaderboardHTML('snake', score);
      gameContainer.appendChild(lbDiv);
      const reBtn = lbDiv.querySelector('#snake-gameover-restart-btn');
      if (reBtn) reBtn.onclick = () => startSnakeGame(mountId);
    }
  }

  currentSnakeLoop = setInterval(draw, 120);
}

function startTTTGame(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  if (typeof logAnalyticsEvent === 'function') {
    logAnalyticsEvent('cli_game_start', { game_name: 'tictactoe' });
  }
  saveLocalGameLog('Tic-Tac-Toe', 'Game Started');

  let board = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true;

  mount.innerHTML = `
    <div class="cli-game-container">
      <div class="cli-game-header">
        <span>❌⭕ Tic-Tac-Toe vs Medical AI</span>
        <span id="ttt-status" style="color:#34d399;">Your Turn (X)</span>
      </div>
      <div class="cli-ttt-grid">
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<div class="cli-ttt-cell" data-idx="${i}"></div>`).join('')}
      </div>
      <div class="cli-game-controls">
        <button class="cli-game-btn" id="ttt-reset-btn">Restart Game</button>
      </div>
    </div>
  `;

  const cells = mount.querySelectorAll('.cli-ttt-cell');
  const statusEl = mount.querySelector('#ttt-status');

  function checkWin(b, player) {
    const winConditions = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    return winConditions.some(c => c.every(idx => b[idx] === player));
  }

  function aiMove() {
    if (!gameActive) return;
    const emptyIndices = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    if (emptyIndices.length === 0) return;

    let move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    board[move] = 'O';
    cells[move].innerText = 'O';
    cells[move].style.color = '#ef4444';

    if (checkWin(board, 'O')) {
      statusEl.innerText = 'AI Wins! 🤖';
      statusEl.style.color = '#ef4444';
      gameActive = false;
    } else if (board.every(cell => cell !== '')) {
      statusEl.innerText = "It's a Draw! 🤝";
      statusEl.style.color = '#f59e0b';
      gameActive = false;
    } else {
      statusEl.innerText = 'Your Turn (X)';
      statusEl.style.color = '#34d399';
    }
  }

  cells.forEach(cell => {
    cell.onclick = () => {
      const idx = parseInt(cell.getAttribute('data-idx'));
      if (board[idx] !== '' || !gameActive) return;

      board[idx] = 'X';
      cell.innerText = 'X';
      cell.style.color = '#38bdf8';

      if (checkWin(board, 'X')) {
        statusEl.innerText = 'YOU WIN! 🎉';
        statusEl.style.color = '#34d399';
        gameActive = false;
      } else if (board.every(c => c !== '')) {
        statusEl.innerText = "It's a Draw! 🤝";
        statusEl.style.color = '#f59e0b';
        gameActive = false;
      } else {
        statusEl.innerText = 'AI Thinking...';
        statusEl.style.color = '#f59e0b';
        setTimeout(aiMove, 400);
      }
    };
  });

  mount.querySelector('#ttt-reset-btn').onclick = () => startTTTGame(mountId);
}

function startGuessGame(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  if (typeof logAnalyticsEvent === 'function') {
    logAnalyticsEvent('cli_game_start', { game_name: 'number_guess' });
  }
  saveLocalGameLog('Number Guess', 'Game Started');

  const targetNum = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;

  mount.innerHTML = `
    <div class="cli-game-container">
      <div class="cli-game-header">
        <span>🎯 Number Guessing Game</span>
        <span>Target: 1 ~ 100</span>
      </div>
      <div style="text-align:center; margin:10px 0;">
        <p id="guess-hint" style="color:#38bdf8; font-weight:600;">Guess a number between 1 and 100!</p>
        <div style="display:flex; justify-content:center; gap:8px; margin-top:10px;">
          <input type="number" id="guess-input" min="1" max="100" style="width:90px; padding:6px; background:#1e293b; border:1px solid #334155; color:#fff; border-radius:4px; font-size:1rem; text-align:center;">
          <button class="cli-game-btn" id="guess-submit-btn">Submit</button>
        </div>
      </div>
    </div>
  `;

  const input = mount.querySelector('#guess-input');
  const btn = mount.querySelector('#guess-submit-btn');
  const hint = mount.querySelector('#guess-hint');

  function checkGuess() {
    const val = parseInt(input.value);
    if (isNaN(val) || val < 1 || val > 100) return;
    attempts++;
    if (val === targetNum) {
      hint.innerHTML = `<span style="color:#34d399; font-weight:bold;">🎉 BINGO! Correct in ${attempts} tries!</span>`;
      btn.innerText = 'Play Again';
      btn.onclick = () => startGuessGame(mountId);
      recordScore('guess', 'Player', attempts, true);
      const gameContainer = mount.querySelector('.cli-game-container');
      if (gameContainer && !gameContainer.querySelector('.cli-lb-container')) {
        const lbDiv = document.createElement('div');
        lbDiv.innerHTML = renderLeaderboardHTML('guess', attempts);
        gameContainer.appendChild(lbDiv);
      }
    } else if (val > targetNum) {
      hint.innerHTML = `<span style="color:#ef4444;">📉 ${val} is Too High! Try lower. (Attempt #${attempts})</span>`;
    } else {
      hint.innerHTML = `<span style="color:#f59e0b;">📈 ${val} is Too Low! Try higher. (Attempt #${attempts})</span>`;
    }
    input.value = '';
    input.focus();
  }

  btn.onclick = checkGuess;
  input.onkeydown = (e) => { if (e.key === 'Enter') checkGuess(); };
  input.focus();
}

let currentPacmanLoop = null;

function startPacmanGame(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  if (currentPacmanLoop) clearInterval(currentPacmanLoop);

  if (typeof logAnalyticsEvent === 'function') {
    logAnalyticsEvent('cli_game_start', { game_name: 'pacman' });
  }
  saveLocalGameLog('Pac-Man', 'Game Started');

  mount.innerHTML = `
    <div class="cli-game-container">
      <div class="cli-game-header">
        <span>🟡 Retro Pac-Man</span>
        <span>Lives: <span id="pacman-lives">❤️❤️❤️</span> | Score: <span id="pacman-score">0</span></span>
      </div>
      <canvas id="pacman-canvas" width="240" height="176" class="cli-pacman-canvas"></canvas>
      <div class="cli-game-controls">
        <button class="cli-game-btn" id="pacman-btn-up">▲</button>
      </div>
      <div class="cli-game-controls">
        <button class="cli-game-btn" id="pacman-btn-left">◄</button>
        <button class="cli-game-btn" id="pacman-btn-down">▼</button>
        <button class="cli-game-btn" id="pacman-btn-right">►</button>
        <button class="cli-game-btn" id="pacman-restart-btn" style="background:#0284c7; color:#fff; border-color:#38bdf8;">🔄 Restart</button>
      </div>
    </div>
  `;

  const canvas = document.getElementById('pacman-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const mazeTemplate = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,1,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,2,1,1,1,1,1,2,1],
    [1,3,1,0,1,2,2,2,1,0,0,0,1,3,1],
    [1,2,1,1,1,2,1,2,1,1,1,2,1,2,1],
    [1,2,2,2,2,2,1,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,1,2,2,2,2,2,1,2,2,2,1],
    [1,1,1,2,1,2,1,1,1,2,1,2,1,1,1],
    [1,3,2,2,2,2,2,0,2,2,2,2,2,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  let map = JSON.parse(JSON.stringify(mazeTemplate));
  const tileSize = 16;
  const rows = map.length;
  const cols = map[0].length;

  let pacman = { x: 7, y: 9, dirX: 0, dirY: 0, nextDirX: 0, nextDirY: 0 };
  let ghosts = [
    { x: 1, y: 1, dirX: 1, dirY: 0, color: '#ef4444' },
    { x: 13, y: 1, dirX: -1, dirY: 0, color: '#38bdf8' }
  ];

  let score = 0;
  let lives = 3;
  let gameOver = false;
  let mouthAngle = 0.2;
  let mouthSpeed = 0.05;

  function countPellets() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (map[r][c] === 2 || map[r][c] === 3) count++;
      }
    }
    return count;
  }

  function setDirection(dx, dy) {
    pacman.nextDirX = dx;
    pacman.nextDirY = dy;
  }

  document.getElementById('pacman-btn-up').onclick = () => setDirection(0, -1);
  document.getElementById('pacman-btn-down').onclick = () => setDirection(0, 1);
  document.getElementById('pacman-btn-left').onclick = () => setDirection(-1, 0);
  document.getElementById('pacman-btn-right').onclick = () => setDirection(1, 0);
  document.getElementById('pacman-restart-btn').onclick = () => startPacmanGame(mountId);

  const keyHandler = (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === 'ArrowUp' || e.key === 'w') setDirection(0, -1);
    if (e.key === 'ArrowDown' || e.key === 's') setDirection(0, 1);
    if (e.key === 'ArrowLeft' || e.key === 'a') setDirection(-1, 0);
    if (e.key === 'ArrowRight' || e.key === 'd') setDirection(1, 0);
  };
  document.addEventListener('keydown', keyHandler);

  function canMove(x, y, dx, dy) {
    const nextX = x + dx;
    const nextY = y + dy;
    if (nextX < 0 || nextX >= cols || nextY < 0 || nextY >= rows) return false;
    return map[nextY][nextX] !== 1;
  }

  function update() {
    if (gameOver) return;

    if (canMove(pacman.x, pacman.y, pacman.nextDirX, pacman.nextDirY)) {
      pacman.dirX = pacman.nextDirX;
      pacman.dirY = pacman.nextDirY;
    }

    if (canMove(pacman.x, pacman.y, pacman.dirX, pacman.dirY)) {
      pacman.x += pacman.dirX;
      pacman.y += pacman.dirY;
    }

    if (map[pacman.y][pacman.x] === 2) {
      map[pacman.y][pacman.x] = 0;
      score += 10;
      updateScore();
    } else if (map[pacman.y][pacman.x] === 3) {
      map[pacman.y][pacman.x] = 0;
      score += 50;
      updateScore();
    }

    ghosts.forEach(g => {
      const possibleDirs = [
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 }
      ].filter(d => canMove(g.x, g.y, d.dx, d.dy) && !(d.dx === -g.dirX && d.dy === -g.dirY));

      if (possibleDirs.length > 0) {
        const choice = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
        g.dirX = choice.dx;
        g.dirY = choice.dy;
      } else if (canMove(g.x, g.y, -g.dirX, -g.dirY)) {
        g.dirX = -g.dirX;
        g.dirY = -g.dirY;
      }

      g.x += g.dirX;
      g.y += g.dirY;

      if (g.x === pacman.x && g.y === pacman.y) {
        lives--;
        updateLives();
        if (lives <= 0) {
          endGame(false);
        } else {
          pacman.x = 7;
          pacman.y = 9;
          pacman.dirX = 0;
          pacman.dirY = 0;
          pacman.nextDirX = 0;
          pacman.nextDirY = 0;
        }
      }
    });

    if (countPellets() === 0) {
      endGame(true);
    }
  }

  function updateScore() {
    const el = document.getElementById('pacman-score');
    if (el) el.innerText = score;
  }

  function updateLives() {
    const el = document.getElementById('pacman-lives');
    if (el) el.innerText = '❤️'.repeat(Math.max(0, lives));
  }

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = map[r][c];
        const px = c * tileSize;
        const py = r * tileSize;

        if (tile === 1) {
          ctx.fillStyle = '#1d4ed8';
          ctx.fillRect(px, py, tileSize, tileSize);
          ctx.strokeStyle = '#3b82f6';
          ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);
        } else if (tile === 2) {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(px + tileSize/2, py + tileSize/2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (tile === 3) {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(px + tileSize/2, py + tileSize/2, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const px = pacman.x * tileSize + tileSize / 2;
    const py = pacman.y * tileSize + tileSize / 2;
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    let rotate = 0;
    if (pacman.dirX === 1) rotate = 0;
    if (pacman.dirX === -1) rotate = Math.PI;
    if (pacman.dirY === 1) rotate = Math.PI / 2;
    if (pacman.dirY === -1) rotate = -Math.PI / 2;

    mouthAngle += mouthSpeed;
    if (mouthAngle > 0.35 || mouthAngle < 0.05) mouthSpeed = -mouthSpeed;

    ctx.arc(px, py, tileSize/2 - 1, rotate + mouthAngle, rotate + Math.PI * 2 - mouthAngle);
    ctx.lineTo(px, py);
    ctx.fill();

    ghosts.forEach(g => {
      const gx = g.x * tileSize + tileSize / 2;
      const gy = g.y * tileSize + tileSize / 2;

      ctx.fillStyle = g.color;
      ctx.beginPath();
      ctx.arc(gx, gy - 2, tileSize/2 - 2, Math.PI, 0, false);
      ctx.lineTo(gx + tileSize/2 - 2, gy + tileSize/2 - 2);
      ctx.lineTo(gx - tileSize/2 + 2, gy + tileSize/2 - 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(gx - 3, gy - 3, 2.5, 0, Math.PI * 2);
      ctx.arc(gx + 3, gy - 3, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(gx - 2, gy - 3, 1, 0, Math.PI * 2);
      ctx.arc(gx + 4, gy - 3, 1, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function endGame(isWin) {
    gameOver = true;
    clearInterval(currentPacmanLoop);
    document.removeEventListener('keydown', keyHandler);
    if (typeof logAnalyticsEvent === 'function') {
      logAnalyticsEvent('cli_game_over', { game_name: 'pacman', score: score, is_win: isWin });
    }
    saveLocalGameLog('Pac-Man', `Score: ${score} (${isWin ? 'VICTORY' : 'DEFEAT'})`);
    recordScore('pacman', 'Player', score);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = isWin ? '#34d399' : '#ef4444';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isWin ? 'VICTORY!' : 'GAME OVER!', canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '12px monospace';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 15);

    const gameContainer = mount.querySelector('.cli-game-container');
    if (gameContainer && !gameContainer.querySelector('.cli-lb-container')) {
      const lbDiv = document.createElement('div');
      lbDiv.innerHTML = `
        <div style="text-align:center; margin:10px 0;">
          <button class="cli-game-btn" id="pacman-gameover-restart-btn" style="background:#2563eb; color:#fff; padding:8px 16px; font-size:0.9rem; font-weight:bold; width:100%; box-shadow:0 0 10px rgba(37,99,235,0.4);">🎮 Play Again / Restart 🔄</button>
        </div>
      ` + renderLeaderboardHTML('pacman', score);
      gameContainer.appendChild(lbDiv);
      const reBtn = lbDiv.querySelector('#pacman-gameover-restart-btn');
      if (reBtn) reBtn.onclick = () => startPacmanGame(mountId);
    }
  }

  currentPacmanLoop = setInterval(() => {
    update();
    draw();
  }, 160);
}
