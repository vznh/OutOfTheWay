class Car extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'car');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setScale(96 / 512);
        this.isMoving = false;

        // Ensure position is on grid
        this.x = Math.round(this.x / 64) * 64;
        this.y = Math.round(this.y / 64) * 64;
    }

    randomMove() {
        const directions = [
            { x: this.x + 64, y: this.y },  // right
            { x: this.x - 64, y: this.y },  // left
            { x: this.x, y: this.y + 64 },  // down
            { x: this.x, y: this.y - 64 }   // up
        ];

        return directions[Math.floor(Math.random() * directions.length)];
    }

    moveCar(x, y, onComplete = null) {
        if (this.isMoving || !this.scene || !this.scene.tweens) return;
        
        this.isMoving = true;
        
        // Store the tween reference
        this.currentTween = this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {
                this.isMoving = false;
                // Clear the tween reference
                this.currentTween = null;
                if (onComplete && this.scene) {
                    onComplete();
                }
            }
        });
    }

    destroy(fromScene) {
        // Cancel any ongoing tween
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
        }
        super.destroy(fromScene);
    }
} 