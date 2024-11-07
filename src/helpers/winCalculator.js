import { WinText } from '../components/WinText';
import { Animations } from "./animations";
import { EVENTS } from "../lib/constants.js";

export class WinCalculator {

    static async checkWinLines(originalGrid , winlines, gridSize, app) {
        const grid = originalGrid.slice(0, 5).map(row => row.slice(0, 5));
        let totalWin = 0;
        let winningLines = [];
        
        winlines.forEach((winline, index) => {
            let isWinning = true;
            
            winline.positions.forEach(pos => {
                if (grid[pos.row][pos.column] !== pos.symID) {
                    isWinning = false;
                }
            });
            
            if (isWinning) {
                totalWin += winline.payout;
                winningLines.push({
                    lineNumber: index + 1,
                    payout: winline.payout,
                    positions: winline.positions
                });
                
                WinText.create(winline.payout, winline.positions[0], app, gridSize);
                
                winline.positions.forEach(pos => {
                    const symbol = app.stage.children[0].children[pos.row].children[pos.column];
                    (Animations.pulseWinningSymbol(symbol));
                });
            }
        });

        if (totalWin > 0) {
            window.dispatchEvent(new CustomEvent(EVENTS.GAME.WIN, { 
                detail: { amount: totalWin }
            }));
            console.log('🎰 CONGRATULATIONS! YOU WON! 🎰');
            console.log(`💰 Total Win: ${totalWin} credits 💰`);
            console.log('Winning Lines:', winningLines);
        } else { 
            window.dispatchEvent(new CustomEvent(EVENTS.GAME.LOSE));
            window.dispatchEvent(new CustomEvent(EVENTS.GAME.END));
            console.log('😢 No wins this time. Try again! 😢');
        }

        return { totalWin, winningLines };
    }
} 