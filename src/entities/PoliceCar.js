// PoliceCar.js
class PoliceCar extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'pcar');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setScale(48 / 512);
        this.turnsRemaining = 2; // Police car stays for 2 turns
        this.warningText = null;

        // Ensure position is on grid
        this.x = Math.round(this.x / 64) * 64;
        this.y = Math.round(this.y / 64) * 64;
        
        // Add warning text above police car
        this.createWarning();
    }

    createWarning() {
        this.warningText = this.scene.add.text(this.x, this.y - 40, "NO GAS!", {
            fontSize: '16px',
            fill: '#ffff00',
            backgroundColor: '#000000',
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5);
    }

    updateTurnCount() {
        this.turnsRemaining--;
        if (this.turnsRemaining <= 0) {
            if (this.warningText) {
                this.warningText.destroy();
            }
            return true; // Return true when police car should be removed
        }
        return false;
    }

    disableGas() {
        return true; // Always disable gas when police car is present
    }

    destroy() {
        if (this.warningText) {
            this.warningText.destroy();
        }
        super.destroy();
    }
} 