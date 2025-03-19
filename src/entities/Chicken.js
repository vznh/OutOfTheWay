class Chicken extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'chicken');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setScale(25.6 / 512);

        // Ensure position is on grid
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
                // Ensure final position is on grid
                this.x = Math.round(this.x / 64) * 64;
                this.y = Math.round(this.y / 64) * 64;
                if (onComplete) onComplete();
            }
        });
    }

    chasePlayer(player) {
        // Calculate direction to player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        
        // Determine which direction to move (prioritize horizontal movement)
        let newX = this.x;
        let newY = this.y;
        
        if (Math.abs(dx) > 0) {
            newX += Math.sign(dx) * 64;
        } else if (Math.abs(dy) > 0) {
            newY += Math.sign(dy) * 64;
        }

        // Ensure new position is within bounds and on grid
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