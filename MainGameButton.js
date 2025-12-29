import { GameStates } from './GameState';

export class MainGameButton {
    constructor(buttonElement, gameState) {
        this.button = buttonElement;
        this.gameState = gameState;
        
        this.gameState.subscribe(state => this.onStateChange(state));
        
        this.setupEventListener();
    }
    
    setupEventListener() {
        this.button.addEventListener('click', () => this.handleClick());
    }
    
    handleClick() {
        try {
            const state = this.gameState.currentStateName;
            console.log('Estado atual:', state);
            
            switch(state) {
                case GameStates.READY:
                case GameStates.GAME_OVER:
                    this.gameState.start();
                    break;
                case GameStates.PLAYING:
                    this.gameState.pause();
                    break;
                case GameStates.PAUSED:
                    this.gameState.start();
                    break;
            }
        } catch (error) {
            console.error('Erro ao lidar com clique:', error);
        }
    }
     
    onStateChange(state) {
        this.updateLabel(this.getLabelForState(state));
    }
    
    getLabelForState(state) {
        const labels = {
            [GameStates.READY]: 'Start Game',
            [GameStates.PLAYING]: 'Pause',
            [GameStates.PAUSED]: 'Resume',
            [GameStates.GAME_OVER]: 'Play Again'
        };
        return labels[state] || 'Start';
    }
    
    updateLabel(text) {
        this.button.textContent = text;
    }
    
    show() {
        this.button.classList.remove('hide');
    }
    
    hide() {
        this.button.classList.add('hide');
    }
}