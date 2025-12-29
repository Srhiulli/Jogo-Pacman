//observer pattern to update button label based on game state
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
        const state = this.gameState.currentState.constructor.name;
        
        switch(state) {
            case 'ReadyState':
            case 'GameOverState':
                this.gameState.start();
                break;
            case 'PlayingState':
                this.gameState.pause();
                break;
            case 'PausedState':
                this.gameState.start();
                break;
        }
    }
    
    onStateChange(state) {
        this.updateLabel(this.getLabelForState(state));
    }
    
    getLabelForState(state) {
        const labels = {
            'ReadyState': 'Start Game',
            'PlayingState': 'Pause',
            'PausedState': 'Resume',
            'GameOverState': 'Play Again'
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