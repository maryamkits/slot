import * as PIXI from "pixi.js";
import { gsap } from "gsap";

export class WinText {
    static create(payout, startPosition, app, gridSize) {
        // Create win text with styling
        const winText = new PIXI.Text(`+${payout}`, {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        });

        // Position text at first symbol of winning line
        const startX = (800 - (gridSize * 80)) / 2 + (startPosition.column * 80);
        const startY = (600 - (gridSize * 80)) / 2 + (startPosition.row * 80);
        
        winText.x = startX;
        winText.y = startY;
        winText.alpha = 0;

        // Add to stage
        app.stage.addChild(winText);

        // Animate using GSAP
        gsap.timeline()
            .to(winText, {
                alpha: 1,
                y: winText.y - 50,
                duration: 0.5,
                ease: "power2.out"
            })
            .to(winText, {
                alpha: 0,
                y: winText.y - 100,
                duration: 0.5,
                delay: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    app.stage.removeChild(winText);
                }
            });
    }
} 