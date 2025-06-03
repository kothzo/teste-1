
const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const scoreBoard = document.getElementById('score');
const goal = document.querySelector('.goal');
let score = 0;
let carrying = false;
const items = [];

function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('howToPlayScreen').style.display = 'flex';
}

function goToGame() {
  document.getElementById('howToPlayScreen').style.display = 'none';
  gameArea.style.display = 'flex';
  score = 0;
  carrying = false;
  updateScore();
  clearItems();
  for (let i = 0; i < 3; i++) spawnItem();
}

function spawnItem() {
  const item = document.createElement('div');
  item.className = 'item';
  item.style.top = Math.random() * (gameArea.clientHeight - 50) + 'px';
  item.style.left = Math.random() * (gameArea.clientWidth - 50) + 'px';
  gameArea.appendChild(item);
  items.push(item);
}

function clearItems() {
  items.forEach(item => item.remove());
  items.length = 0;
}

function checkCollision(a, b) {
  const rect1 = a.getBoundingClientRect();
  const rect2 = b.getBoundingClientRect();
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

function updateScore() {
  scoreBoard.textContent = `Pontos: ${score}`;
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

function checkGoalCollision() {
  if (carrying && checkCollision(player, goal)) {
    score++;
    carrying = false;
    updateScore();
    spawnItem();
  }
}

function movePlayer(dx, dy) {
  const step = 10;
  let top = parseInt(player.style.top || 0);
  let left = parseInt(player.style.left || 0);
  let newTop = top + dy * step;
  let newLeft = left + dx * step;

  if (newTop >= 0 && newTop + 100 <= gameArea.clientHeight) {
    player.style.top = newTop + 'px';
  }
  if (newLeft >= 0 && newLeft + 100 <= gameArea.clientWidth) {
    player.style.left = newLeft + 'px';
  }

  checkItemCollision();
  checkGoalCollision();
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') movePlayer(0, -1);
  if (e.key === 'ArrowDown') movePlayer(0, 1);
  if (e.key === 'ArrowLeft') movePlayer(-1, 0);
  if (e.key === 'ArrowRight') movePlayer(1, 0);
});
