class Car extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'car');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setScale(96 / 512);

        // Ensure position is on grid
        this.x = Math.round(this.x / 64) * 64;
        this.y = Math.round(this.y / 64) * 64;
    }

    moveCar(newX, newY, onComplete) {
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

    randomMove() {
        const possibleMoves = [
            { dx: 0, dy: -64 },
            { dx: 0, dy: 64 },
            { dx: -64, dy: 0 },
            { dx: 64, dy: 0 }
        ];
        
        const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        const newX = this.x + move.dx;
        const newY = this.y + move.dy;
        
        // Check boundaries
        if (newX >= 32 && newX <= 608 && newY >= 32 && newY <= 352) {
            return {
                x: Math.round(newX / 64) * 64,
                y: Math.round(newY / 64) * 64
            };
        }
        
        return {
            x: this.x,
            y: this.y
        };
    }
} 