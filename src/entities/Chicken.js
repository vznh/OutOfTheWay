// Chicken.js
class Chicken extends Phaser.GameObjects.Sprite {
  /**
   * Chicken enemy game object.
   *
   * Constructor: Creates and initializes chicken sprite.
   * moveChicken: Animates chicken to new position.
   * chasePlayer: Calculates next position toward player.
   * checkPlayerCollision: Detects if player is caught.
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'chicken');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(25.6 / 512);

    this.x = Math.round(this.x / 64) * 64;
    this.y = Math.round(this.y / 64) * 64;
  }

  moveChicken(newX, newY, onComplete) {
    this.scene.tweens.add({
      targets: this,
      x: newX,
      y: newY,
      duration: 200,
      ease: 'Linear',
      onComplete: () => {
        this.x = Math.round(this.x / 64) * 64;
        this.y = Math.round(this.y / 64) * 64;
        if (onComplete) onComplete();
      }
    });
  }

  chasePlayer(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;

    let newX = this.x;
    let newY = this.y;

    const prioritizeX = Math.random() > 0.5;

    if ((Math.abs(dx) > Math.abs(dy) && prioritizeX) || (Math.abs(dx) <= Math.abs(dy) && !prioritizeX)) {
      if (dx !== 0) {
        newX += Math.sign(dx) * 64;
      }
    } else {
      if (dy !== 0) {
        newY += Math.sign(dy) * 64;
      }
    }

    newX = Math.max(32, Math.min(608, newX));
    newY = Math.max(32, Math.min(352, newY));

    return {
      x: Math.round(newX / 64) * 64,
      y: Math.round(newY / 64) * 64
    };
  }

  checkPlayerCollision(player) {
    return this.x === player.x && this.y === player.y;
  }
}
