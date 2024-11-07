import * as PIXI from "pixi.js";
import { EVENTS, CONSTANTS } from '../lib/constants';

export function animateReels(context) {
    setupTicker(context);
    updateTicker(context);

    if (window.dispatchEvent(new CustomEvent(EVENTS.REEL.SPIN_START))) {
        for (let i = 0; i < CONSTANTS.GRID.SIZE; i++) {
            const r = context._reels[i];
            r.position = 0; 
            const target = r.position + 25;
            const time = 1500 + i * 300;

            tweenTo({
                object: r,
                property: 'position',
                propertyBeginValue: r.position,
                target: target,
                start: Date.now(),
                time: time,
                easing: backout(0.8),
                change: null,
                complete: (function(i) {
                    return function() {
                        if (i === CONSTANTS.GRID.SIZE - 1) {
                            reelsComplete(context); 
                        }
                    };
                })(i)
            }, context);
        }
    }
}

function setupTicker(context) {
    PIXI.Ticker.shared.add(() => {
        const now = Date.now();
        const remove = [];

        for (let i = 0; i < context.tweening.length; i++) {
            const t = context.tweening[i];
            const phase = Math.min(1, (now - t.start) / t.time);

            t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
            if (t.change) t.change(t);
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete) t.complete(t);
                remove.push(t);
            }
        }
        for (let i = 0; i < remove.length; i++) {
            context.tweening.splice(context.tweening.indexOf(remove[i]), 1);
        }
    });
}

function updateTicker(context) {
    context.newGrid = generateNewGrid();
    PIXI.Ticker.shared.add(() => {
        for (let i = 0; i < context._reels.length; i++) {
            const r = context._reels[i];
            r.blur.blurY = (r.position - r.previousPosition) * 16;
            r.previousPosition = r.position;

            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];

                const prevy = s.y;
                s.y = ((r.position + j) % r.symbols.length) * context.symbolSize - context.symbolSize;

                if (s.y < 0 && prevy > context.symbolSize) {
                    const textureIndex = context.newGrid[j][i];
                    const texture = context.slotTextures[textureIndex];
                    s.texture = texture;
                    s.id = textureIndex;

                    s.scale.x = s.scale.y = Math.min(
                        context.symbolSize / s.texture.width, 
                        context.symbolSize / s.texture.height
                    );
                    s.x = Math.round((context.symbolSize - s.width) / 2);
                }
            }
        }
    });
}

// Helpers
function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

function backout(amount) {
    return (t) => --t * t * ((amount + 1) * t + amount) + 1;
}

function tweenTo(tween, context) {
    if (!context.tweening) {
        context.tweening = [];
    }
    context.tweening.push(tween);
}

const reelsComplete = () => {
    window.dispatchEvent(new CustomEvent(EVENTS.REEL.SPIN_COMPLETE));
};



const generateNewGrid = () => {
    return Array(6).fill(0).map(() =>
      Array(6).fill(0).map(() => Math.floor(Math.random() * 11))
    );
  };