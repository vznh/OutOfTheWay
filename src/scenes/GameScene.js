// GameScene.js
class GameScene extends Phaser.Scene {
  constructor() {
    super("playScene");
  }

  preload() {
    // Load the player sprite sheet using peter.png
    this.load.spritesheet("player", "./assets/peter.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.audio("boop", "./assets/boop.mp3");
  }

  create() {
    // Set player's starting position to a random grid on left 2 columns
    const randomRow = Phaser.Math.Between(2, 7);
    const randomCol = Phaser.Math.Between(0, 1);
    this.player = this.add.sprite(
      16 + randomCol * 32,
      16 + randomRow * 32,
      "player",
    );
    this.physics.add.existing(this.player);

    // Draw a grid overlay for visual reference
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.3);
    for (let x = 0; x <= 320; x += 32) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, 320);
    }
    for (let y = 0; y <= 320; y += 32) {
      graphics.moveTo(0, y);
      graphics.lineTo(320, y);
    }
    graphics.strokePath();

    // Listen for key presses for grid-based movement
    this.input.keyboard.on("keydown", (event) => {
      let newX = this.player.x;
      let newY = this.player.y;

      if (event.key === "ArrowUp") {
        newY -= 32;
      } else if (event.key === "ArrowDown") {
        newY += 32;
      } else if (event.key === "ArrowLeft") {
        newX -= 32;
      } else if (event.key === "ArrowRight") {
        newX += 32;
      } else {
        return; // Ignore other keys
      }

      // Boundaries: player centers must stay between 16 and 304
      if (newX >= 16 && newX <= 304 && newY >= 16 && newY <= 304) {
        this.player.setPosition(newX, newY);
        // Play move sound effect
        this.sound.play("./assets/boop.mp3");
        console.log("Move sound effect should play");
      }
    });
  }

  update() {
    // No continuous movement needed - movement is handled in key events.
  }
}
