import { LEVEL, OBJECT_TYPE } from './setup';
import { GameBoard, GameContext } from './GameBoard';
import Pacman from './Pacman';
import Ghost from './Ghosts';
import { blinkyBehavior, pinkyBehavior, inkyBehavior, clydeBehavior } from './ghostBehaviors';
import { GameState } from './GameState';
import { MainGameButton } from './MainGameButton';

// Verificar se elementos existem
const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const mainButton = document.querySelector('#main-button');

if (!gameGrid || !scoreTable || !mainButton) {
    console.error('Elementos DOM não encontrados:', {
        gameGrid: !!gameGrid,
        scoreTable: !!scoreTable,
        mainButton: !!mainButton
    });
    throw new Error('Elementos DOM necessários não foram encontrados');
}

try {
    const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);
    const gameContext = GameContext.createGameContext(gameBoard);

    const gameState = new GameState({
        gameBoard,
        gameContext,
        mainButton,  
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

    const gameButton = new MainGameButton(mainButton, gameState);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const state = gameState.currentState.constructor.name;
            if (state === 'PlayingState') gameState.pause();
            else if (state === 'PausedState') gameState.start();
        }
    });

    console.log('Jogo inicializado com sucesso!');
} catch (error) {
    console.error('Erro ao inicializar o jogo:', error);
}