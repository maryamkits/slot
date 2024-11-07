import { gsap } from "gsap";
import * as PIXI from "pixi.js";
import { EVENTS } from "../lib/constants";

export class Animations {
    static pulseWinningSymbol(symbol) {
            if (!symbol) {
                return;
            }
            const originalScale = { x: symbol.scale.x, y: symbol.scale.y };
            const originalPosition = { x: symbol.x, y: symbol.y };
            const originalPivot = { x: symbol.pivot.x, y: symbol.pivot.y };
            const originalAnchor = { x: symbol.anchor.x, y: symbol.anchor.y };
            
            symbol.anchor.set(0.5, 0.5);
            const centerX = symbol.x + symbol.width / 2;
            const centerY = symbol.y + symbol.height / 2;
            symbol.pivot.set(0, -symbol.height);
            symbol.position.set(centerX, centerY);

            symbol.zIndex = 1;
            symbol.parent.sortableChildren = true;

            gsap.timeline({
                repeat: 2,  
                onComplete: () => {
                    symbol.anchor.set(originalAnchor.x, originalAnchor.y);
                    symbol.pivot.set(originalPivot.x, originalPivot.y);
                    symbol.position.set(originalPosition.x, originalPosition.y);
                    symbol.scale.set(originalScale.x, originalScale.y);
                    symbol.zIndex = 0;
                    window.dispatchEvent(new CustomEvent(EVENTS.GAME.END));
                }
            })
                .to(symbol.scale, {
                    x: 0.6,
                    y: 0.6,
                    duration: 0.3,
                    ease: "power2.out"
                })
                .to(symbol.scale, {
                    x: originalScale.x,
                    y: originalScale.y,
                    duration: 0.3,
                    ease: "power2.in",
                });
                
            symbol.alpha = 1;
    }

    static floatingWinText(text, startX, startY, app) {
        text.x = startX;
        text.y = startY;
        text.alpha = 0;

        app.stage.addChild(text);

        gsap.timeline()
            .to(text, {
                alpha: 1,
                y: text.y - 50,
                duration: 0.5,
                ease: "power2.out"
            })
            .to(text, {
                alpha: 0,
                y: text.y - 100,
                duration: 0.5,
                delay: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    app.stage.removeChild(text);
                }
            });
    }

    static createWinText(value) {
        return new PIXI.Text(`+${value}`, {
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
    }
}
