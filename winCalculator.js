import { WinText } from '../components/WinText';
import { gsap } from "gsap";

export class WinCalculator {

    static checkWinLines(originalGrid , winlines, gridSize, app) {
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
                if (symbol) {
                    const originalScale = { x: symbol.scale.x, y: symbol.scale.y };
                    
                    symbol.anchor.set(0.5, 0.5);
                    
                    const centerX = symbol.x + symbol.width / 2;
                    const centerY = symbol.y + symbol.height / 2;
                    symbol.pivot.set(0, -symbol.height);
                    symbol.position.set(centerX, centerY);

                    symbol.zIndex = 1;
                    symbol.parent.sortableChildren = true;

                    gsap.timeline({repeat: 2})
                        .to(symbol.scale, {
                            x:  0.6,
                            y:  0.6,
                            duration: 0.3,
                            ease: "power2.out"
                        })
                        .to(symbol.scale, {
                            x: originalScale.x,
                            y: originalScale.y,
                            duration: 0.3,
                            ease: "power2.in"
                        });
                    symbol.alpha = 1;
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