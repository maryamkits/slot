import {
    Container,
    Texture,
    Sprite,
} from 'pixi.js';
import '@pixi/spine-pixi'; 
import * as PIXI from 'pixi.js';
import { CONSTANTS, EVENTS } from '../lib/constants.js';
import { addEventListeners } from '../helpers/addEventListeners';
import data from '../assets/json/winnings.json';
import { WinCalculator } from '../helpers/winCalculator.js';
import { buildReels } from './buildReels';
import { animateReels } from './animateReels';



export default class Reels extends PIXI.Container {
    private _reels: Array<any> = [];
    private slotTextures!: Texture[];
    private symbolKeys: string[] = [];
    private symbolSize: number;
    private reelWidth: number;

    constructor() {
        super();
        this.symbolKeys = CONSTANTS.SYMBOLS.KEYS;
        this.symbolSize = CONSTANTS.GRID.SYMBOL_SIZE;
        this.reelWidth = CONSTANTS.GRID.REEL_WIDTH;
        this.initializeTextures();
     
        addEventListeners(this);
    }

     async loadAssets() {
        const assetsToLoad = this.symbolKeys.map(key => `assets/sprites/${key}.jpg`);
        await PIXI.Assets.init()
        await PIXI.Assets.load(assetsToLoad);
     }

    private async initializeTextures(): Promise<void> {
        await this.loadAssets();
        this.slotTextures = this.symbolKeys.map(key => 
            Texture.from(`assets/sprites/${key}.jpg`)
        );

        buildReels(this);
    }


    public startPlay(app: any) {
        animateReels(this, app);
    }

    get(index: number): any {
        return this._reels[index];
    }

    handleEvents(event: Event) {
        console.log('handleEvents', event.type);
        switch (event.type) {
            case EVENTS.REEL.SPIN_START:
                break;
            case EVENTS.REEL.SPIN_COMPLETE:
                break;
        }
    }


    // private getCurrentGrid(): number[][] {
    //     const grid: number[][] = [];
        
    //     for (let row = 0; row < 5; row++) {
    //         grid[row] = [];
    //         for (let col = 0; col < CONSTANTS.GRID.SIZE; col++) {
    //             const reel = this._reels[col];
    //             const symbol = reel.symbols[row];
    //             const symID = symbol.texture.label
    //             console.log('symID', symID)
    //            // const symID = this.symbolKeys.indexOf(symbol.texture.textureCacheIds[0])
    //                 //.split('/').pop().split('.')[0]);
    //             grid[row][col] = symID;
    //         }
    //     }
    //     console.log('grid', grid)
    //     return grid;
    // }

//    async checkWin() {
//         const currentGrid = this.getCurrentGrid();
//         const winnings = await fetch('assets/json/winnings.json')
//         .then(response => response.json())

//         WinCalculator.checkWinLines(currentGrid, winnings.winlines, CONSTANTS.GRID.SIZE, this.gridContainer, this.app);
//     }
} 