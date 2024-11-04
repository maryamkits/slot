import { WinText } from '../components/WinText';

export class WinCalculator {
    static checkWinLines(grid, winlines, gridSize, gridContainer, app) {
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
                    const symbolIndex = pos.row * gridSize + pos.column;
                    const symbol = gridContainer.children[symbolIndex];
                    if (symbol) {
                        symbol.alpha = 0.5;
                        setTimeout(() => {
                            symbol.alpha = 1;
                        }, 1000);
                    }
                });
            }
        });

        if (totalWin > 0) {
            console.log('🎰 CONGRATULATIONS! YOU WON! 🎰');
            console.log(`💰 Total Win: ${totalWin} credits 💰`);
            console.log('Winning Lines:', winningLines);
        } else {
            console.log('😢 No wins this time. Try again! 😢');
        }

        return { totalWin, winningLines };
    }
} 