// main.js
/*
 Phaser features used:
 - Scene management
 - Game object creation
 - Animation handling
 - Input handling
 - Physics handling
 - UI management
 - Sound handling
 - BitmapText
 - Text
 - Image
 - Sprite
 - Rectangle
 - Circle
*/

const config = {
  type: Phaser.AUTO,
  width: 640,  // 10 squares * 64 pixels
  height: 384, // 6 squares * 64 pixels
  scene: [MenuScene, GameScene, CreditsScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);