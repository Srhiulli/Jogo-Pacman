import { LEVEL, OBJECT_TYPE } from './setup';
import  {GameBoard , GameContext} from './GameBoard';
import Pacman from './Pacman';
import Ghost from './Ghosts';
import { blinkyBehavior, pinkyBehavior, inkyBehavior, clydeBehavior } from './ghostBehaviors';



const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const startButton = document.querySelector('#start-button');
const POWER_PILL_TIME = 10000; // ms
const GLOBAL_SPEED = 80; // ms
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);
const gameContext = GameContext.createGameContext(gameBoard);
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;



function gameOver(pacman, grid) {

  document.removeEventListener('keydown', (e) =>
    pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard))
  );

  gameBoard.showGameStatus(gameWin);

  clearInterval(timer);
  startButton.classList.remove('hide');
}

function checkCollision(pacman, ghosts) {
  const collidedGhost = ghosts.find((ghost) => pacman.pos === ghost.pos);

  if (collidedGhost) {
    if (pacman.powerPill) {
      gameBoard.removeObject(collidedGhost.pos, [
        OBJECT_TYPE.GHOST,
        OBJECT_TYPE.SCARED,
        collidedGhost.name
      ]);
      collidedGhost.pos = collidedGhost.startPos;
      score += 100;
    } else {
      gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
      gameBoard.rotateDiv(pacman.pos, 0);
      gameOver(pacman, gameGrid);
    }
  }
}

function gameLoop(pacman, ghosts) {
   gameContext.updateContext(ghosts);

  gameBoard.moveCharacter(pacman);
  checkCollision(pacman, ghosts);

  ghosts.forEach(ghost => {
    gameBoard.moveGhost(ghost, pacman, gameContext);
  });
  checkCollision(pacman, ghosts);

  if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT)) {

    gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
    gameBoard.dotCount--;
    score += 10;
  }
  if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {

    gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);

    pacman.powerPill = true;
    score += 50;

    clearTimeout(powerPillTimer);
    powerPillTimer = setTimeout(
      () => (pacman.powerPill = false),
      POWER_PILL_TIME
    );
  }
  if (pacman.powerPill !== powerPillActive) {
    powerPillActive = pacman.powerPill;
    ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill));
  }
  if (gameBoard.dotCount === 0) {
    gameWin = true;
    gameOver(pacman, gameGrid);
  }
  scoreTable.innerHTML = score;
}

function startGame() {

  gameWin = false;
  powerPillActive = false;
  score = 0;

  startButton.classList.add('hide');

  gameBoard.createGrid(LEVEL);

  const pacman = new Pacman(2, 287);
  gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
  document.addEventListener('keydown', (e) =>
    pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard))
  );

const ghosts = [
  new Ghost(5, 188, blinkyBehavior, OBJECT_TYPE.BLINKY),
  new Ghost(4, 209, pinkyBehavior, OBJECT_TYPE.PINKY),
  new Ghost(3, 230, inkyBehavior, OBJECT_TYPE.INKY),
  new Ghost(2, 251, clydeBehavior, OBJECT_TYPE.CLYDE)
];

  timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
}

startButton.addEventListener('click', startGame);