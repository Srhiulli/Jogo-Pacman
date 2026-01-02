//command pattern
export class InputManager {
    constructor() {
        this.handlers = new Map()
        this.boundHandler = (e) => this.handleInput(e)
    }
    register(entity, objectExistFn) {
        this.handlers.set(entity, objectExistFn)
        document.addEventListener('keydown', this.boundHandler)
    }
    unregister(entity) {
        this.handlers.delete(entity)
        if(this.handlers.size === 0){document.removeEventListener('keydown', this.boundHandler)}
    }
    handleInput(e) {
        if (e.keyCode < 37 || e.keyCode > 40) { return }
        for (const [entity, objectExistFn] of this.handlers) {
            entity.handleKeyInput(e, objectExistFn);
        }
    }
}