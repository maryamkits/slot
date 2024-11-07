import * as PIXI from "pixi.js";
import { CONSTANTS } from "../lib/constants";

export class Title extends PIXI.Container {

    constructor(screenWidth: number, screenHeight: number) {
        super();

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = screenWidth;
        canvas.height = 100;

        if (!context) {
            throw new Error('Failed to get 2D context');
        }

        const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#A855F7');
        gradient.addColorStop(1, 'white');

        // Set styles with centered text alignment
        context.fillStyle = gradient;
        context.font = 'italic 30px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        context.fillText('MARIAM`S SLOT MACHINE', canvas.width / 2, canvas.height / 2);

        const texture = PIXI.Texture.from(canvas);
        const gradientText = new PIXI.Sprite(texture);
        
        gradientText.x = 0;
        gradientText.y = 50;

        this.addChild(gradientText);
    }
}