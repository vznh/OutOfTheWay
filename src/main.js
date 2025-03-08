// main.js

let game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 320,
  height: 320,
  scene: [MenuScene, GameScene],
  physics: {
    default: "arcade",
  },
});
let keyRESET;
