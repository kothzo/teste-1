const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const scoreBoard = document.getElementById('score');
const livesBoard = document.getElementById('lives');
const goal = document.querySelector('.goal');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreLabel = document.getElementById('finalScore');

let score = 0;
let lives = 3;
let carrying = false;
let items = [];
let enemies = [];

function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('howToPlayScreen').style.display = 'flex';
}

function goToGame() {
  document.getElementById('howToPlayScreen').style.display = 'none';
  document.getElementById('gameOverScreen').style.display = 'none';
  gameArea.style.display = 'block';

  score = 0;
  lives = 3;
  carrying = false;
  updateScore();
  updateLives();

  clearItems();
  clearEnemies();

  spawnItem();
  createEnemyCars();
  moveEnemyCars();
}

function checkCollision(a, b) {
  const rect1 = a.getBoundingClientRect();
  const rect2 = b.getBoundingClientRect();
  return !(
    rect1.top > rect2.bottom ||
    rect1.bottom < rect2.top ||
    rect1.right < rect2.left ||
    rect1.left > rect2.right
  );
}

// move do player
function movePlayer(dx, dy) {
  const step = 10;
  let top = parseInt(player.style.top || 0);
  let left = parseInt(player.style.left || 0);
  let newTop = top + dy * step;
  let newLeft = left + dx * step;

  if (newTop >= 0 && newTop + 80 <= gameArea.clientHeight) {
    player.style.top = newTop + 'px';
  }
  if (newLeft >= 0 && newLeft + 50 <= gameArea.clientWidth) {
    player.style.left = newLeft + 'px';
  }

  checkItemCollision();
  checkGoalCollision();
  checkEnemyCollision();
}

function checkItemCollision() {
  if (!carrying) {
    for (let i = 0; i < items.length; i++) {
      if (checkCollision(player, items[i])) {
        carrying = true;
        items[i].remove();
        items.splice(i, 1);
        break;
      }
    }
  }
}

// verifica se chegou na cidade
function checkGoalCollision() {
  if (carrying && checkCollision(player, goal)) {
    score++;
    carrying = false;
    updateScore();
    spawnItem();
  }
}

// verifica colisão com carros inimigos
function checkEnemyCollision() {
  for (const enemy of enemies) {
    if (checkCollision(player, enemy)) {
      lives--;
      updateLives();
      if (lives <= 0) {
        endGame();
      } else {
        resetPlayer();
      }
    }
  }
}

function updateScore() {
  scoreBoard.textContent = `Pontos: ${score}`;
}

function updateLives() {
  livesBoard.textContent = `Vidas: ${lives}`;
}

// reset  posição do jogador
function resetPlayer() {
  player.style.top = '50%';
  player.style.left = '50%';
  player.style.transform = 'translate(-50%, -50%)';
}

// gera suprimentos
function spawnItem() {
  const item = document.createElement('div');
  item.className = 'item';
  item.style.top = Math.random() * (gameArea.clientHeight - 40) + 'px';
  item.style.left = Math.random() * (gameArea.clientWidth - 40) + 'px';
  gameArea.appendChild(item);
  items.push(item);
}

// clear suprimentos
function clearItems() {
  items.forEach(item => item.remove());
  items = [];
}

// clear carros
function clearEnemies() {
  enemies.forEach(enemy => enemy.remove());
  enemies = [];
}

// carros na 1 pistas
function createEnemyCars() {
  const lanesVertical = [100, 250, 400];

  const enemyImages = [
    'https://i.ibb.co/nsmqY9g/car-pc5.png',        // Full Red
    'https://i.ibb.co/pBRnv6N/car-pc7.png',        // Polícia 2.0
    'https://i.ibb.co/gFh7jRT/car-pc6.png',        // Full White
    'https://i.ibb.co/C3gGx5g/mc2.png'             // MacLaren
  ];

  // Carros na pista vertical (vêm de cima para baixo)
  lanesVertical.forEach(lane => {
    const enemy = document.createElement('img');
    enemy.className = 'enemy';
    enemy.src = enemyImages[Math.floor(Math.random() * enemyImages.length)];
    enemy.style.top = '-100px';
    enemy.style.left = lane + 'px';
    gameArea.appendChild(enemy);
    enemies.push(enemy);
  });
}

// carro na pista

function moveEnemyCars() {
  enemies.forEach(enemy => {
    let interval = setInterval(() => {
      if (enemy.dataset.direction === 'horizontal') {
        let left = parseInt(enemy.style.left || 0);
        if (left > window.innerWidth) {
          enemy.style.left = '-100px';
        } else {
          enemy.style.left = (left + 5) + 'px';
        }
      } else {
        let top = parseInt(enemy.style.top || 0);
        if (top > window.innerHeight) {
          enemy.style.top = '-100px';
        } else {
          enemy.style.top = (top + 5) + 'px';
        }
      }

      checkEnemyCollision();
    }, 30);
  });
}

function endGame() {
  finalScoreLabel.textContent = score;
  gameArea.style.display = 'none';
  gameOverScreen.style.display = 'flex';
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') movePlayer(0, -1);
  if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') movePlayer(0, 1);
  if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') movePlayer(-1, 0);
  if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') movePlayer(1, 0);
});
