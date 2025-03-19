class PoliceCar extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'pcar');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setScale(48 / 512);

        // Ensure position is on grid
        this.x = Math.round(this.x / 64) * 64;
        this.y = Math.round(this.y / 64) * 64;
    }

    movePolice(onComplete) {
        this.scene.tweens.add({
            targets: this,
            x: 0,
            duration: 200,
            ease: 'Linear',
            onComplete: () => {
                // Ensure final position is on grid
                this.x = Math.round(this.x / 64) * 64;
                this.y = Math.round(this.y / 64) * 64;
                if (onComplete) onComplete();
            }
        });
    }

    isInTopRow() {
        return this.y === 32;
    }

    disableGas() {
        return this.isInTopRow();
    }
} 