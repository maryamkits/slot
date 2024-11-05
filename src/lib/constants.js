export const EVENTS = {
    REEL: {
        SPIN_START: 'reel:spin_start',
        SPIN_COMPLETE: 'reel:spin_complete',
        SPIN_STOP: 'reel:spin_stop',
        UPDATE: 'reel:update'
    },
    GAME: {
        START: 'game:start',
        END: 'game:end',
        WIN: 'game:win',
        LOSE: 'game:lose'
    },
    ASSETS: {
        LOAD_START: 'assets:load_start',
        LOAD_COMPLETE: 'assets:load_complete',
        LOAD_ERROR: 'assets:load_error'
    },
    UI: {
        BUTTON_CLICK: 'ui:button_click',
        BUTTON_ENABLE: 'ui:button_enable',
        BUTTON_DISABLE: 'ui:button_disable'
    }
};

export const CONSTANTS = {
    GRID: {
        SIZE: 5,
        SYMBOL_SIZE: 100,
        SPACING: 10,
        REEL_WIDTH: 120,
    },
    ANIMATION: {
        SPIN_DURATION: 3000,
        STOP_DELAY: 500,
        WIN_DURATION: 1000
    },
    SYMBOLS: {
        KEYS: ['w_1', 'm_2', 'l_1', 'l_2', 'l_3', 'l_4', 'm_1', 'm_3', 'm_4', 'm_5', 'l_5'],
        PATH: 'assets/sprites'
    },
    VIEWPORT: {
        WIDTH: 800,
        HEIGHT: 600
    }
};

// Type for event payloads
export const EventPayload = {
    SPIN_START: EVENTS.REEL.SPIN_START,
    SPIN_COMPLETE: EVENTS.REEL.SPIN_COMPLETE,
    SPIN_STOP: EVENTS.REEL.SPIN_STOP,
    WIN: EVENTS.GAME.WIN,
    LOSE: EVENTS.GAME.LOSE,
};