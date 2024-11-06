import { CONSTANTS } from './lib/constants';
import {
    Application,
    Graphics,
  } from 'pixi.js';
  import { PlayButton} from './components/PlayButton';
  import { LoaderScreen } from './components/loader';
import { Reels } from './components/Reels';
  
  (async () =>
  {
    const app = new Application();
    await app.init({backgroundColor:'rgb(17 24 39)', width:1000, height:800});

    app.canvas.style.position = 'absolute';
    app.canvas.style.left = '50%';
    app.canvas.style.top = '50%';
    app.canvas.style.transform = 'translate(-50%, -50%)';

    document.body.appendChild(app.canvas);

    const reels = new Reels(app);

    const loadingScreen = new LoaderScreen(app);
    let progress = 0;
    const time = 100;
    const loadInterval = setInterval(() => {
        progress += 0.1;
        loadingScreen.updateProgress(Math.min(progress, 1));
        if (progress >= 1) {
        clearInterval(loadInterval);
        loadingScreen.destroy();
        app.stage.addChild(reels);
        startGame();
    }
}, time);

    // Use grid size from constants
    const { SIZE: GRID_SIZE, SYMBOL_SIZE, REEL_WIDTH } = CONSTANTS.GRID;
    const startGame = () => {
  
    // Build top & bottom covers and position reelContainer
    const margin = (app.screen.height - SYMBOL_SIZE * GRID_SIZE) / 2;
    const extraMargin = 10;
  
    reels.y = margin;
    reels.x = (app.screen.width - REEL_WIDTH * GRID_SIZE) / 2;
    const top = new Graphics().rect(0, 0, app.screen.width, margin).fill({ color: 'rgb(17 24 39)' });
    const bottom = new Graphics().rect(0, SYMBOL_SIZE * GRID_SIZE + margin, app.screen.width, margin ).fill({ color: 'rgb(17 24 39)' });
  

  const SpinButton = new PlayButton(app.screen.width, app.screen.height);
  SpinButton.x = Math.round((bottom.width - SpinButton.width) / 2);
  SpinButton.y = app.screen.height - (margin+extraMargin) + Math.round((margin - SpinButton.height) / 2);
  bottom.addChild(SpinButton);

  SpinButton.on('playButtonClicked', () => {
    console.log('playButtonClicked');
    reels.startPlay(app);
});
  
    app.stage.addChild(top);
    app.stage.addChild(bottom);
    }

  })();
  