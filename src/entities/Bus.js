// Bus.js
class Bus extends Phaser.GameObjects.Sprite {
  /**
   * Creates a bus sprite with physics.
   *
   * @param {Phaser.Scene} scene - Game scene to add bus to
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'bus');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(64 / 512);

    this.x = Math.round(this.x / 64) * 64;
    this.y = Math.round(this.y / 64) * 64;
  }

  /**
   * Animates bus to new position.
   *
   * @param {number} newX - Target x position
   * @param {number} newY - Target y position
   * @param {Function} onComplete - Callback after movement completes
   */
  moveBus(newX, newY, onComplete) {
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

  /**
   * Calculates next position to follow player.
   *
   * @param {Phaser.GameObjects.Sprite} player - Player to chase
   * @returns {Object} Next position coordinates
   */
  chasePlayer(player) {
    const playerLane = Math.floor((player.y - 32) / 64);
    const busLane = Math.floor((this.y - 32) / 64);

    if (busLane !== playerLane) {
      let newY = this.y;
      if (playerLane > busLane) {
        newY += 64;
      } else {
        newY -= 64;
      }

      if (newY >= 32 && newY <= 352) {
        return {
          x: this.x,
          y: Math.round(newY / 64) * 64
        };
      }
    }

    return {
      x: this.x,
      y: this.y
    };
  }
}
