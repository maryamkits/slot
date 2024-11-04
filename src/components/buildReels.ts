import { Container, Sprite, BlurFilter, Texture } from 'pixi.js';
import { CONSTANTS } from '../lib/constants.js';
import data from '../assets/json/winnings.json';

export function buildReels(context: any) {
    for (let i = 0; i < CONSTANTS.GRID.SIZE; i++) {
        const rc = new Container();
        rc.x = i * context.reelWidth;
        context.addChild(rc);

        const reel = {
            container: rc,
            symbols: [] as Sprite[],
            position: 0,
            previousPosition: 0,
            blur: new BlurFilter(),
        };

        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        buildSymbols(reel, i, context);
        context._reels.push(reel);
    }
}

function buildSymbols(reel: any, reelIndex: number, context: any) {
    const initialGrid = data.grid;
    for (let j = 0; j < 6; j++) {
        let symbol;
        if (j < 5) {
            const symID = initialGrid[j][reelIndex];
            symbol = new Sprite(context.slotTextures[symID]);
        } else {
            symbol = new Sprite(context.slotTextures[Math.floor(Math.random() * context.slotTextures.length)]);
        }
        
        symbol.y = j * context.symbolSize;
        symbol.scale.x = symbol.scale.y = Math.min(context.symbolSize / symbol.width, context.symbolSize / symbol.height);
        symbol.x = Math.round((context.symbolSize - symbol.width) / 2);
        reel.symbols.push(symbol);
        reel.container.addChild(symbol);
    }
} 