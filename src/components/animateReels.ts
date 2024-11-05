import * as PIXI from "pixi.js";
import { EVENTS, CONSTANTS } from '../lib/constants';

const INITIAL_GRID: any[][] = [
    [3, 1, 2, 3, 4],
    [4, 0, 1, 2, 5],
    [5, 1, 2, 4, 5],
    [5, 0, 1, 2, 3],
    [4, 1, 2, 5, 5]
  ];

export function animateReels(context: any) {
    setupTicker(context);
    updateTicker(context);
    
    if (window.dispatchEvent(new CustomEvent(EVENTS.REEL.SPIN_START))) {
        for (let i = 0; i < CONSTANTS.GRID.SIZE; i++) {
            const r = context._reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 20 + i * 5 + extra;
            const time = 1500 + i * 300 + extra * 300;

            tweenTo({
                object: r,
                property: 'position',
                propertyBeginValue: r.position,
                target: target,
                start: Date.now(),
                time: time,
                easing: backout(0.8),
                change: null,
                complete: i ===  CONSTANTS.GRID.SIZE - 1 ? reelsComplete : null
            }, context);
        }
    }
}

// Animation ticker for smooth transitions
function setupTicker(context: any): void {
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

// Visual update ticker for reel spinning
function updateTicker(context: any): void {
    const newGrid: number[][] =  
    [[ 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 1, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 1 ], 
    [ 0, 0, 0, 0, 0, 1 ]
]
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
                    const textureIndex = newGrid[j % newGrid.length][i % newGrid[j].length];
                    s.texture = context.slotTextures[textureIndex];

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

// Helper functions
function lerp(a1: number, a2: number, t: number): number {
    return a1 * (1 - t) + a2 * t;
}

function backout(amount: number) {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
}

function tweenTo(tween: any, context: any) {
    if (!context.tweening) {
        context.tweening = [];
    }
    context.tweening.push(tween);
}

const reelsComplete = () => window.dispatchEvent(new CustomEvent(EVENTS.REEL.SPIN_COMPLETE));


const generateNewGrid = (): any[][] => {
    return Array(5).fill(0).map(() =>
      Array(5).fill(0).map(() => Math.floor(Math.random() * 11))
    );
  };

