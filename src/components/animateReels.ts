import * as PIXI from "pixi.js";
import { Spine } from '@pixi/spine-pixi';
import { EVENTS, CONSTANTS } from '../lib/constants';
import lowAtlas from '../assets/spine/low/low.atlas';
import lowJson from '../assets/spine/low/low.json';

let newGrid = Array(5).fill(null).map(() => Array(5).fill(null));

export function animateReels(context: any, app: any) {
    // Ensure grid is updated
  //  updateGrid();
    
    // Begin ticker for animations
    updateTicker(context, app);
    
    // if (window.dispatchEvent(new CustomEvent(EVENTS.REEL.SPIN_START))) {
    //     for (let i = 0; i < CONSTANTS.GRID.SIZE; i++) {
    //         const r = context._reels[i];
    //         const extra = Math.floor(Math.random() * 3);
    //         const target = r.position + 20 + i * 5 + extra;
    //         const time = 1500 + i * 300 + extra * 300;

    //         tweenTo({
    //             object: r,
    //             property: 'position',
    //             propertyBeginValue: r.position,
    //             target: target,
    //             start: Date.now(),
    //             time: time,
    //             easing: backout(0.8),
    //             change: null,
    //             complete: i === CONSTANTS.GRID.SIZE - 1 ? reelsComplete : null
    //         }, context);
    //     }
    // }
}

// Visual update ticker for reel spinning
function updateTicker(context: any, app: any): void {
    console.log('updateTicker')
    const GRID_TRANSITION_DURATION = 1000; // 1 second
    let gridTransitionStartTime: number = Date.now();
    let isAnimating = true;

    // Initialize spine animation for each symbol if not already done
    if (!context._reels.symbolKeys) {
        context._reels.symbolKeys = [];

        PIXI.Assets.load([
            "../assets/spine/low/low.atlas",
            "../assets/spine/low/low.json"
        ]).then(() => {
            const spineData = PIXI.Assets.get("../assets/spine/low/low.json");
        
            // Validate spineData before proceeding
            if (!spineData) {
                console.error("Loaded spineData is undefined.");
                return;
            }
        
            console.log('Loaded spineData:', spineData); // Check the structure
        
            // Check for the required version string
            if (!spineData || !spineData.skeleton || !spineData.skeleton.spine) {
                console.error("spineData is missing or malformed. Please verify JSON structure.");
                return; // Exit if data is not valid
            }
        
            const lowPayoutSpine = new Spine(spineData); // Create Spine instance
        
            lowPayoutSpine.x = app.screen.width / 2; // Positioning
            lowPayoutSpine.y = app.screen.height / 2;
        
            // Set animation (replace with an actual animation name)
            lowPayoutSpine.state.setAnimation(0, 'landing', true);
        
            app.stage.addChild(lowPayoutSpine); // Add to stage
        }).catch((error) => {
            console.error("Error loading spine animations:", error);
        });

        
        
        
    }

    // Remove any existing tickers first
    PIXI.Ticker.shared.remove(animate);

    function animate() {
        if (!isAnimating) return;

        const currentTime = Date.now();
        const elapsed = currentTime - gridTransitionStartTime;
        const progress = Math.min(elapsed / GRID_TRANSITION_DURATION, 1);

        // Update grid values with cascade effect
        for (let col = 0; col < 5; col++) {
            const colDelay = col * 0.1;
            const colProgress = Math.max(0, Math.min(1, (progress * 1.5) - colDelay));
            
            if (colProgress < 1) {
                for (let row = 0; row < 5; row++) {
                    // Update symbol during animation
                    const newSymbolIndex =  newGrid[row][col];
                    newGrid[row][col] = newSymbolIndex;

                    // Update spine animation
                    const spine = context._reels[col].symbols[row];
                    console.log(spine)
                    spine.state.timeScale = 2; // Speed up during spin
                }
            } else {
                // Column has finished spinning
                for (let row = 0; row < 5; row++) {
                    // Set final symbol
                    newGrid[row][col] = newGrid[row][col];

                    // Update spine animation
                    const spine = context._reels[col].symbols[row];
                    spine.state.timeScale = 1; // Normal speed
                    spine.state.setAnimation(0, 'idle', true); // Switch to idle animation
                }
            }
        }

        // Stop animation when complete
        if (progress >= 1) {
            isAnimating = false;
            // Set final grid state
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    newGrid[row][col] = newGrid[row][col];
                }
            }
        }
    }

    // Add the animation function to the ticker
 //   PIXI.Ticker.shared.add(animate);
}

function updateGrid() {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            newGrid[row][col] = Math.floor(Math.random() * CONSTANTS.SYMBOLS.KEYS.length);
        }
    }
}

// Other functions remain unchanged


function regenerateSymbol(symbol: any, context: any): void {
    // Pick random symbol
    const symbolIndex = Math.floor(Math.random() * context.slotTextures.length);
    const newTexture = PIXI.Texture.from(`assets/sprites/${context.symbolKeys[symbolIndex]}.jpg`);
    
    // Update symbol properties
    symbol.texture = newTexture;
    
    // Scale to fit symbol size
    const scale = Math.min(
        context.symbolSize / newTexture.width,
        context.symbolSize / newTexture.height
    );
    symbol.scale.set(scale);
    
    // Center the symbol
    symbol.x = (context.symbolSize - symbol.width) / 2;
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
