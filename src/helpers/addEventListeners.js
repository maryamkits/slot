import { EVENTS } from "../lib/constants";

const events = [
    EVENTS.REEL.SPIN_START,
    EVENTS.REEL.SPIN_COMPLETE,
    EVENTS.REEL.SPIN_STOP,
    EVENTS.REEL.UPDATE
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