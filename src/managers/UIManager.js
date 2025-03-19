class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.scoreText = null;
        this.gasText = null;
        this.warningText = null;
    }

    updateScoreDisplay(score) {
        if (this.scoreText) {
            this.scoreText.destroy();
        }
        this.scoreText = this.scene.add.text(16, 16, `Score: ${score}`, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
    }

    updateGasDisplay(gas) {
        if (this.gasText) {
            this.gasText.destroy();
        }
        this.gasText = this.scene.add.text(624, 16, `Gas: ${gas}`, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(1, 0);
    }

    showWarningText(message) {
        if (this.warningText) {
            this.warningText.destroy();
        }
        
        this.warningText = this.scene.add.text(320, 352, message, {
            fontSize: '20px',
            fill: '#ffff00',
            fontFamily: 'Arial',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        
        // Auto-remove after 2 seconds
        this.scene.time.delayedCall(2000, () => {
            if (this.warningText) {
                this.warningText.destroy();
                this.warningText = null;
            }
        });
    }

    showFailScreen(reason, score) {
        const overlay = this.scene.add.rectangle(320, 192, 640, 384, 0x000000, 0.7);
        
        const gameOverText = this.scene.add.text(320, 160, 'Game Over!', {
            fontSize: '48px',
            fill: '#ff0000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        const reasonText = this.scene.add.text(320, 220, reason, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        const scoreText = this.scene.add.text(320, 260, `Final Score: ${score}`, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        const restartText = this.scene.add.text(320, 320, 'Press ESC to try again', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }

    showWinScreen(score) {
        const overlay = this.scene.add.rectangle(320, 192, 640, 384, 0x000000, 0.7);
        
        const winText = this.scene.add.text(320, 192, 'You Win!', {
            fontSize: '48px',
            fill: '#00ff00',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        const scoreText = this.scene.add.text(320, 256, `Final Score: ${score}`, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        const restartText = this.scene.add.text(320, 320, 'Press ESC to play again', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }

    createExplosion(x, y) {
        const explosion = this.scene.add.sprite(x, y, "explosion");
        explosion.setScale(64/256);
        explosion.play('explode'); // Play the explosion animation
        this.scene.time.delayedCall(500, () => {
            explosion.destroy();
        });
    }
} 