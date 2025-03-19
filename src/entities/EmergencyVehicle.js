// EmergencyVehicle.js
class EmergencyVehicle extends Phaser.GameObjects.Sprite {
  /**
   * Emergency vehicle that creates danger zones on the road.
   * Initializes a vehicle, sets up physics, and positions on grid.
   * Handles movement animation, danger zone creation, and collision detection.
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'emergency');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(96 / 512);
    this.dangerZone = null;
    this.warningText = null;
    this.isMoving = false;
    this.isFirstTurn = true;

    this.x = Math.round(this.x / 64) * 64;
    this.y = Math.round(this.y / 64) * 64;
  }

  /**
   * Animates vehicle movement off screen.
   */
  moveEmergency(onComplete) {
    if (this.isMoving) return;

    this.isMoving = true;
    this.isFirstTurn = false;

    this.scene.tweens.add({
      targets: this,
      x: 640 + 64,
      duration: 1000,
      ease: 'Linear',
      onComplete: () => {
        if (this.dangerZone) {
          this.dangerZone.destroy();
        }
        if (this.warningText) {
          this.warningText.destroy();
        }
        this.destroy();
        if (onComplete) onComplete();
      }
    });
  }

  /**
   * Creates visual warning zone and text.
   */
  createDangerZone() {
    this.dangerZone = this.scene.add.graphics();
    this.updateDangerZone();

    this.warningText = this.scene.add.text(320, this.y - 50, "! WARNING: EMERGENCY INCOMING !", {
      fontSize: '20px',
      fill: this.isFirstTurn ? '#ffff00' : '#ff0000',
      backgroundColor: '#000000',
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
  }

  /**
   * Updates danger zone visuals based on state.
   */
  updateDangerZone() {
    if (this.dangerZone) {
      this.dangerZone.clear();

      const color = this.isFirstTurn ? 0xffff00 : 0xff0000;
      const alpha = this.isFirstTurn ? 0.2 : 0.3;

      this.dangerZone.fillStyle(color, alpha);
      this.dangerZone.fillRect(0, this.y - 32, 640, 64);

      this.dangerZone.lineStyle(2, color);
      this.dangerZone.strokeRect(0, this.y - 32, 640, 64);

      for (let x = 32; x < 640; x += 64) {
        this.dangerZone.fillStyle(color, this.isFirstTurn ? 0.4 : 0.7);
        this.dangerZone.fillRect(x - 16, this.y - 16, 32, 32);
      }
    }

    if (this.warningText) {
      this.warningText.setStyle({
        fontSize: '20px',
        fill: this.isFirstTurn ? '#ffff00' : '#ff0000',
        backgroundColor: '#000000',
        padding: { x: 5, y: 2 }
      });
    }
  }

  /**
   * Checks if position is in danger zone.
   */
  isDangerousPosition(x, y) {
    return y === this.y && !this.isFirstTurn;
  }
}
