import { Application, Container, Graphics, Text } from 'pixi.js';

export class LoaderScreen {
    private container: Container;
    private loadingText: Text;
    private loadingBar: Graphics;

    constructor(app: Application) {
        this.container = new Container();
        
        // Create loading text
        this.loadingText = new Text('Loading...', {
            fontSize: 36,
            fill: 0xffffff,
        });
        this.loadingText.anchor.set(0.5);
        this.loadingText.position.set(
            app.screen.width / 2,
            app.screen.height / 2 - 50
        );

        // Create loading bar
        this.loadingBar = new Graphics();
        this.drawLoadingBar(0);

        // Add to container
        this.container.addChild(this.loadingText, this.loadingBar);
        app.stage.addChild(this.container);
    }

    private drawLoadingBar(progress: number): void {
        const width = 300;
        const height = 20;
        const x = this.loadingText.x - width / 2;
        const y = this.loadingText.y + 50;

        this.loadingBar.clear();
        
        // Draw background
        this.loadingBar.beginFill(0x333333);
        this.loadingBar.drawRect(x, y, width, height);
        this.loadingBar.endFill();
        
        // Draw progress
        this.loadingBar.beginFill(0x00ff00);
        this.loadingBar.drawRect(x, y, width * progress, height);
        this.loadingBar.endFill();
    }

    public updateProgress(progress: number): void {
        this.drawLoadingBar(progress);
        this.loadingText.text = `Loading... ${Math.floor(progress * 100)}%`;
    }

    public destroy(): void {
        this.container.destroy(true);
    }
}