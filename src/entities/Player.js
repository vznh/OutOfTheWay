class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setScale(64 / 512);
        this.score = 0;
        this.gas = 2;
        this.maxGas = 2;

        // Ensure position is on grid
        this.x = Math.round(this.x / 64) * 64;
        this.y = Math.round(this.y / 64) * 64;
    }

    movePlayer(newX, newY, onComplete) {
        this.scene.tweens.add({
            targets: this,
            x: newX,
            y: newY,
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

    updateScore(points) {
        this.score += points;
    }

    useGas() {
        if (this.gas > 0) {
            this.gas--;
            return true;
        }
        return false;
    }

    refillGas() {
        this.gas = this.maxGas;
    }
} 