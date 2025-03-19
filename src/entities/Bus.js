class Bus extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bus');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setScale(64 / 512);

        // Ensure position is on grid
        this.x = Math.round(this.x / 64) * 64;
        this.y = Math.round(this.y / 64) * 64;
    }

    moveBus(newX, newY, onComplete) {
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
        // Get player's lane (y position)
        const playerLane = Math.floor((player.y - 32) / 64);
        const busLane = Math.floor((this.y - 32) / 64);
        
        // If bus is not in the same lane as player, try to move to player's lane
        if (busLane !== playerLane) {
            let newY = this.y;
            if (playerLane > busLane) {
                newY += 64; // Move down
            } else {
                newY -= 64; // Move up
            }
            
            // Ensure the new position is within bounds and on grid
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