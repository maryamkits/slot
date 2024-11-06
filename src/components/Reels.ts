import {
    Container,
    Texture,
    Sprite,
} from 'pixi.js';
import '@pixi/spine-pixi'; 
import * as PIXI from 'pixi.js';
import { CONSTANTS, EVENTS } from '../lib/constants.js';
import { addEventListeners } from '../helpers/addEventListeners';

import { WinCalculator } from '../helpers/winCalculator.js';
import { buildReels } from './buildReels';
import { animateReels } from './animateReels';
import data from '../assets/json/winnings.json';



export class Reels extends PIXI.Container {
    private _reels: Array<any> = [];
    private slotTextures!: Texture[];
    private symbolKeys: string[] = [];
    private symbolSize: number;
    private reelWidth: number;
    newGrid: number[][] = [];
    app: any;
    constructor(app: any) {
        super();
        addEventListeners(this);
        this.symbolKeys = CONSTANTS.SYMBOLS.KEYS;
        this.symbolSize = CONSTANTS.GRID.SYMBOL_SIZE;
        this.reelWidth = CONSTANTS.GRID.REEL_WIDTH;
        this.app = app;
        this.initializeTextures();
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
        animateReels(this)
    }

    handleEvents(event: Event) {
        console.log('handleEvents', event.type);
        switch (event.type) {
            case EVENTS.REEL.SPIN_START:
                break;
            case EVENTS.REEL.SPIN_COMPLETE:
                this.checkWin()
                break;
        }
    }

    checkWin() {
        WinCalculator.checkWinLines(this.newGrid, data.winlines, CONSTANTS.GRID.SIZE, this.app);
    }
} 