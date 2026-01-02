export const GameStates = {
    READY: 'READY',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER'
};
export class GameState {
    constructor(gameConfig) {
        this.gameConfig = gameConfig; 
        this.currentState = new ReadyState(this);
        this.currentStateName = GameStates.READY;
        this.score = 0;
        this.pacman = null;
        this.ghosts = [];
        this.timer = null;
        this.powerPillTimer = null;
        this.observers = [];
        this.inputManager = gameConfig.inputManager;
    }
    subscribe(callback) {
        this.observers.push(callback);
    }
    
    notify(stateName) {
        this.observers.forEach(callback => callback(stateName));
    }
    
    setState(state, stateName) {
        this.currentState = state;
        this.currentStateName = stateName;
        this.notify(stateName);
    }
    updateButtonLabel(text) {
        this.gameConfig.mainButton.textContent = text;
    }
    
    start() { this.currentState.start(); }
    pause() { this.currentState.pause(); }
    gameOver(win) { this.currentState.gameOver(win); }
    update() { this.currentState.update(); }
    
    resetGame() {
        this.score = 0;
        if (this.pacman) {
            this.inputManager.unregister(this.pacman);
        }
        this.pacman = null;
        this.ghosts = [];
        if (this.timer) clearInterval(this.timer);
        if (this.powerPillTimer) clearTimeout(this.powerPillTimer);
    }
}

class ReadyState {
    constructor(gameState) {
        this.gameState = gameState;
    }
    
    start() {
        const gs = this.gameState;
        const config = gs.gameConfig;
        
        gs.resetGame();
        config.gameBoard.createGrid(config.LEVEL);
        
        gs.pacman = new config.Pacman(2, 287);
        config.gameBoard.addObject(287, [config.OBJECT_TYPE.PACMAN]);
        
        const handleInput = (e) => 
            gs.pacman.handleKeyInput(e, config.gameBoard.objectExist.bind(config.gameBoard));
            gs.inputManager.register(
                gs.pacman,
                config.gameBoard.objectExist.bind(config.gameBoard)
             );  
        
        gs.ghosts = [
            new config.Ghost(5, 188, config.blinkyBehavior, config.OBJECT_TYPE.BLINKY),
            new config.Ghost(4, 209, config.pinkyBehavior, config.OBJECT_TYPE.PINKY),
            new config.Ghost(3, 230, config.inkyBehavior, config.OBJECT_TYPE.INKY),
            new config.Ghost(2, 251, config.clydeBehavior, config.OBJECT_TYPE.CLYDE)
        ];
        
        gs.timer = setInterval(() => this.gameState.update(), config.GLOBAL_SPEED);
        
        this.gameState.setState(new PlayingState(this.gameState), GameStates.PLAYING);

        this.gameState.updateButtonLabel('Pause');
    }
}

class PlayingState {
    constructor(gameState) {
        this.gameState = gameState;
        this.gameState.currentStateName = GameStates.PLAYING;
        this.gameState.updateButtonLabel('Pause');
    }
    
    pause() {
        clearInterval(this.gameState.timer);
        this.gameState.setState(new PausedState(this.gameState), GameStates.PAUSED);
    }
    
    gameOver(win) {
        const gs = this.gameState;
        const config = gs.gameConfig;
        
        clearInterval(gs.timer);
        clearTimeout(gs.powerPillTimer);

        gs.inputManager.unregister(gs.pacman);
        
        config.gameBoard.removeObject(gs.pacman.pos, [config.OBJECT_TYPE.PACMAN]);
        config.gameBoard.showGameStatus(win);
        
        this.gameState.setState(new GameOverState(this.gameState, win));
    }
    
    update() {
        const gs = this.gameState;
        const config = gs.gameConfig;
        
        config.gameContext.updateContext(gs.ghosts);
        config.gameBoard.moveCharacter(gs.pacman);
        this.checkCollision();
        
        gs.ghosts.forEach(ghost => {
            config.gameBoard.moveGhost(ghost, gs.pacman, config.gameContext);
        });
        this.checkCollision();
        
        if (config.gameBoard.objectExist(gs.pacman.pos, config.OBJECT_TYPE.DOT)) {
            config.gameBoard.removeObject(gs.pacman.pos, [config.OBJECT_TYPE.DOT]);
            config.gameBoard.dotCount--;
            gs.score += 10;
        }
        
        if (config.gameBoard.objectExist(gs.pacman.pos, config.OBJECT_TYPE.PILL)) {
            config.gameBoard.removeObject(gs.pacman.pos, [config.OBJECT_TYPE.PILL]);
            gs.pacman.powerPill = true;
            gs.score += 50;
            
            clearTimeout(gs.powerPillTimer);
            gs.powerPillTimer = setTimeout(
                () => (gs.pacman.powerPill = false),
                config.POWER_PILL_TIME
            );
        }
        
        gs.ghosts.forEach((ghost) => (ghost.isScared = gs.pacman.powerPill));
        
        if (config.gameBoard.dotCount === 0) {
            this.gameOver(true);
        }
        
        config.scoreTable.innerHTML = gs.score;
    }
    
    checkCollision() {
        const gs = this.gameState;
        const config = gs.gameConfig;
        const collidedGhost = gs.ghosts.find((ghost) => gs.pacman.pos === ghost.pos);
        
        if (collidedGhost) {
            if (gs.pacman.powerPill) {
                config.gameBoard.removeObject(collidedGhost.pos, [
                    config.OBJECT_TYPE.GHOST,
                    config.OBJECT_TYPE.SCARED,
                    collidedGhost.name
                ]);
                collidedGhost.pos = collidedGhost.startPos;
                gs.score += 100;
            } else {
                this.gameOver(false);
            }
        }
    }
}

class PausedState {
    constructor(gameState) {
        this.gameState = gameState;
    }
    
    start() {
        const config = this.gameState.gameConfig;
        this.gameState.timer = setInterval(
            () => this.gameState.update(), 
            config.GLOBAL_SPEED
        );
        this.gameState.setState(new PlayingState(this.gameState), GameStates.PLAYING);
    }
}

class GameOverState {
    constructor(gameState, win) {
        this.gameState = gameState;
        this.win = win;
    }
    
    start() {
        this.gameState.setState(new ReadyState(this.gameState));
        this.gameState.start();
    }
    
    update() { }
}