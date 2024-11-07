import { EVENTS } from "../lib/constants";

const events = [
    EVENTS.REEL.SPIN_START,
    EVENTS.REEL.SPIN_COMPLETE,
    EVENTS.REEL.SPIN_STOP,
    EVENTS.REEL.UPDATE,
    EVENTS.GAME.WIN,
    EVENTS.GAME.LOSE,
    EVENTS.GAME.END
]

export function addEventListeners(instance) {
    for (let i = 0; i < events.length; i++) {
        window.addEventListener(events[i], instance.handleEvents.bind(instance), false);
    }
}

export function removeEventListeners(instance) {
    for (let i = 0; i < events.length; i++) {
        window.removeEventListener(events[i], instance.handleEvents.bind(instance), false);
    }
}

export function addKeyboardListener(instance) {
    window.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && 
            instance.button.eventMode === 'static' && 
            instance.button.alpha === 1) {
            event.preventDefault();
            instance.emit('playButtonClicked');
        }
    });
}