import { Animations } from '../helpers/animations';

export class WinText {
    static create(payout, startPosition, app, gridSize) {
        const winText = Animations.createWinText(payout);
        
        const startX = (800 - (gridSize * 80)) / 2 + (startPosition.column * 80);
        const startY = (600 - (gridSize * 80)) / 2 + (startPosition.row * 80);
        
        Animations.floatingWinText(winText, startX, startY, app);
    }
} 