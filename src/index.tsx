import { CONSTANTS } from './lib/constants';
import {
    Application,
    Graphics,
  } from 'pixi.js';
  
  import Reels from './components/Reels';
  import {PlayButton} from './components/PlayButton';
  
  (async () =>
  {
    const app = new Application();
    await app.init();
    document.body.appendChild(app.canvas);

    // Use grid size from constants
    const { SIZE: GRID_SIZE, SYMBOL_SIZE, REEL_WIDTH } = CONSTANTS.GRID;
  
    // Create the reels instance
    const reels = new Reels();
    app.stage.addChild(reels);
  
    // Build top & bottom covers and position reelContainer
    const margin = (app.screen.height - SYMBOL_SIZE * GRID_SIZE) / 2;
  
    reels.y = margin;
    reels.x = Math.round(app.screen.width - REEL_WIDTH * GRID_SIZE);
    const top = new Graphics().rect(0, 0, app.screen.width, margin).fill({ color: 0x0 });
    const bottom = new Graphics().rect(0, SYMBOL_SIZE * GRID_SIZE + margin, app.screen.width, margin).fill({ color: 0x0 });
  

  const SpinButton = new PlayButton(app.screen.width, app.screen.height);
  SpinButton.x = Math.round((bottom.width - SpinButton.width) / 2);
  SpinButton.y = app.screen.height - margin + Math.round((margin - SpinButton.height) / 2);
  bottom.addChild(SpinButton);

  SpinButton.on('playButtonClicked', () => {
    console.log('playButtonClicked');
    reels.startPlay(app);
});
  
    app.stage.addChild(top);
    app.stage.addChild(bottom);
  })();
  