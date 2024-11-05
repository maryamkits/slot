import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { EventEmitter } from 'events';
import { EVENTS } from "../lib/constants.js";
import { addEventListeners } from "../helpers/addEventListeners";

export class PlayButton extends PIXI.Container {
    private button: PIXI.Sprite;
    private text: PIXI.Text;
    constructor(screenWidth: number, screenHeight: number) {
        super();
        addEventListeners(this);
        const width = 120;
        const height = 60;
        const radius = 10;
        
        const gradientTexture = this.createGradient(width, height, radius);
        this.button = new PIXI.Sprite(gradientTexture);
                
        this.button.pivot.set(this.button.width / 2, this.button.height / 2);
        this.button.position.set(screenWidth / 2, screenHeight  / 2);

        const text = new PIXI.Text('SPIN', {
            fill: 0xffffff,
            fontSize: 20,
            fontWeight: '700',
            fontStyle: 'italic',
            stroke: 'white',
            dropShadow: {
                color: 0x000000,
                angle: Math.PI / 6,
                blur: 4,
                distance: 6,
                alpha: 0.5,
            },
        });

        text.anchor.set(0.5, 0.5);
        text.position.set(this.button.width / 2 + 2, this.button.height / 2 + 2);
        this.text = text;

        this.button.pivot.set(this.button.width / 2, this.button.height / 2);
        this.button.position.set(this.button.width / 2,  this.button.height / 2);

        this.button.eventMode = 'static';
        this.button.cursor = 'pointer';
        this.text.cursor = 'pointer';

        this.button.on('pointerover', () => this.buttonScaleDown());
        this.button.on('pointerout', () => this.buttonScaleUp());

        this.button.addListener('pointerdown', () => {
            this.buttonScaleDown();
            this.emit('playButtonClicked');
        });
        this.button.on('pointerup', () => this.buttonScaleUp());

        this.addChild(this.button, this.text);
    }

    buttonScaleDown = () => {
        gsap.to(this.button.scale, { x: 0.9, y: 0.9, duration: 0.2 });
        gsap.to(this.text.scale, { x: 0.9, y: 0.9, duration: 0.2 });
    } 
    buttonScaleUp = () => {
        gsap.to(this.button.scale, { x: 1, y: 1, duration: 0.2 }); 
        gsap.to(this.text.scale, { x: 1, y: 1, duration: 0.2 });
    } 
     disableButton(): void {
        this.button.eventMode = 'none';
        this.button.alpha = 0.7;
    }
    enableButton(): void {
        this.button.eventMode = 'static';
        this.button.alpha = 1;
    }
    createGradient(width: number, height: number, radius: number): PIXI.Texture {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if (context) {
            const gradient = context.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, '#A855F7'); 
            gradient.addColorStop(1, '#D946EF'); 


            context.beginPath();
            context.moveTo(radius, 0);
            context.lineTo(width - radius, 0);
            context.quadraticCurveTo(width, 0, width, radius); 
            context.lineTo(width, height - radius); 
            context.quadraticCurveTo(width, height, width - radius, height); 
            context.lineTo(radius, height); 
            context.quadraticCurveTo(0, height, 0, height - radius);
            context.lineTo(0, radius);
            context.quadraticCurveTo(0, 0, radius, 0);
            context.closePath();
            context.clip()
            context.fillStyle = gradient;
            context.fillRect(0, 0, width, height);
        }

        return PIXI.Texture.from(canvas);
    }

    handleEvents(event: Event) {
        console.log('handleEvents', event.type);
        switch (event.type) {
            case EVENTS.REEL.SPIN_START:
                this.disableButton();
                break;
            case EVENTS.REEL.SPIN_COMPLETE:
                this.enableButton();
                this.buttonScaleUp();
                break;
        }
    }
} 