class EmergencyVehicle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'emergency');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setScale(96 / 512);
        this.dangerZone = null;
        this.warningText = null;

        // Ensure position is on grid
        this.x = Math.round(this.x / 64) * 64;
        this.y = Math.round(this.y / 64) * 64;
    }

    moveEmergency(onComplete) {
        this.scene.tweens.add({
            targets: this,
            x: 0,
            duration: 200,
            ease: 'Linear',
            onComplete: () => {
                // Ensure final position is on grid
                this.x = Math.round(this.x / 64) * 64;
                this.y = Math.round(this.y / 64) * 64;
                
                // Clean up danger zone and warning text
                if (this.dangerZone) {
                    this.dangerZone.graphics.destroy();
                    this.dangerZone.text.destroy();
                }
                if (this.warningText) {
                    this.warningText.destroy();
                }
                
                if (onComplete) onComplete();
            }
        });
    }

    createDangerZone() {
        // Create new graphics for danger zone
        const dangerZoneGraphics = this.scene.add.graphics();
        dangerZoneGraphics.lineStyle(2, 0xff0000, 0.5);
        dangerZoneGraphics.fillStyle(0xff0000, 0.2);

        // Calculate emergency vehicle's lane on grid
        const emergencyLane = Math.floor((this.y - 32) / 64);
        
        // Draw red rectangle for the entire lane
        dangerZoneGraphics.fillRect(
            0, // Start from left edge
            32 + emergencyLane * 64, // Start from lane position
            640, // Full width
            64 // One lane height
        );
        
        // Draw red border around the lane
        dangerZoneGraphics.strokeRect(
            0,
            32 + emergencyLane * 64,
            640,
            64
        );

        // Add warning text for the lane
        const dangerText = this.scene.add.text(320, 32 + emergencyLane * 64 + 32, 'DANGER ZONE', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#ff0000',
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5);

        this.dangerZone = { graphics: dangerZoneGraphics, text: dangerText };
    }

    updateDangerZone() {
        if (this.dangerZone) {
            this.dangerZone.graphics.clear();
            this.dangerZone.graphics.lineStyle(2, 0xff0000, 0.5);
            this.dangerZone.graphics.fillStyle(0xff0000, 0.2);

            const emergencyLane = Math.floor((this.y - 32) / 64);
            
            this.dangerZone.graphics.fillRect(
                0,
                32 + emergencyLane * 64,
                640,
                64
            );
            
            this.dangerZone.graphics.strokeRect(
                0,
                32 + emergencyLane * 64,
                640,
                64
            );

            this.dangerZone.text.setPosition(320, 32 + emergencyLane * 64 + 32);
        }
    }
} 