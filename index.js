import { LEVEL, OBJECT_TYPE } from './setup';
import { GameBoard, GameContext } from './GameBoard';
import Pacman from './Pacman';
import Ghost from './Ghosts';
import { blinkyBehavior, pinkyBehavior, inkyBehavior, clydeBehavior } from './ghostBehaviors';
import { GameState } from './GameState';

const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const startButton = document.querySelector('#start-button');

const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);
const gameContext = GameContext.createGameContext(gameBoard);

const gameState = new GameState({
    gameBoard,
    gameContext,
    startButton,
    scoreTable,
    LEVEL,
    OBJECT_TYPE,
    Pacman,
    Ghost,
    blinkyBehavior,
    pinkyBehavior,
    inkyBehavior,
    clydeBehavior,
    POWER_PILL_TIME: 10000,
    GLOBAL_SPEED: 80
});

startButton.addEventListener('click', () => gameState.start());

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') gameState.pause();
});