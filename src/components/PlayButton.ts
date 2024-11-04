import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { EventEmitter } from 'events';
import { EVENTS } from "../lib/constants.js";
import { addEventListeners } from "../helpers/addEventListeners";

const eventEmitter = new EventEmitter();
export { eventEmitter };

export class PlayButton extends PIXI.Container {
    private button: PIXI.Graphics;
    private text: PIXI.Text;
    constructor(screenWidth: number, screenHeight: number) {
        super();
        addEventListeners(this);

        this.button = new PIXI.Graphics();
        this.button.beginFill(0xF05200); 
        this.button.drawRoundedRect(0, 0, 100, 40, 10);
        this.button.endFill();
        
        const text = new PIXI.Text('SPIN', {
            fill: 0xffffff,
            fontSize: 20,
            fontWeight: 'bold',
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
        text.anchor.set(0.5);
        text.position.set(50, 23);
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