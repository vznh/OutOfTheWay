class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.isAnimating = false;
        this.lastDirection = null; // Tracks last movement direction for gas usage
    }

    setupKeyboardInput() {
        this.scene.input.keyboard.on("keydown", (event) => {
            if (this.isAnimating) return;

            let newX = this.scene.player.x;
            let newY = this.scene.player.y;
            let isStayingStill = false;
            let isAccelerating = false;
            let direction = null;

            switch (event.key.toLowerCase()) {
                case "arrowup":
                    newY = Math.max(32, this.scene.player.y - 64);
                    direction = "up";
                    break;
                case "arrowdown":
                    newY = Math.min(352, this.scene.player.y + 64);
                    direction = "down";
                    break;
                case "arrowleft":
                    newX = Math.max(32, this.scene.player.x - 64);
                    direction = "left";
                    break;
                case "arrowright":
                    newX = Math.min(608, this.scene.player.x + 64);
                    direction = "right";
                    break;
                case " ":
                    // Check if any police car is active - if so, prevent gas usage
                    if (this.scene.entityManager.policeCars.length > 0) {
                        this.scene.policeSound.play();
                        this.scene.uiManager.showWarningText("Can't use gas - Police present!");
                        return;
                    }
                    
                    if (this.scene.player.useGas() && this.lastDirection) {
                        isAccelerating = true;
                        
                        // Apply double move in the last direction used
                        switch (this.lastDirection) {
                            case "up":
                                newY = Math.max(32, this.scene.player.y - 128);
                                break;
                            case "down":
                                newY = Math.min(352, this.scene.player.y + 128);
                                break;
                            case "left":
                                newX = Math.max(32, this.scene.player.x - 128);
                                break;
                            case "right":
                                newX = Math.min(608, this.scene.player.x + 128);
                                break;
                        }
                        
                        this.scene.uiManager.updateGasDisplay(this.scene.player.gas);
                    } else if (!this.lastDirection) {
                        this.scene.uiManager.showWarningText("Move in a direction first!");
                        return;
                    } else {
                        this.scene.uiManager.showWarningText("No gas left!");
                        return;
                    }
                    break;
                case "escape":
                    this.scene.scene.start("menuScene");
                    return;
                default:
                    isStayingStill = true;
                    break;
            }

            if (newX === this.scene.player.x && newY === this.scene.player.y) {
                isStayingStill = true;
            }

            // Only check if we're staying within bounds, not entity collisions
            if (!isStayingStill) {
                this.isAnimating = true;
                this.scene.moveSound.play();

                if (!isStayingStill) {
                    this.scene.player.updateScore(-1);
                    this.scene.uiManager.updateScoreDisplay(this.scene.player.score);
                }
                
                // Update last direction if this isn't a gas move
                if (direction && !isAccelerating) {
                    this.lastDirection = direction;
                }

                this.scene.player.movePlayer(newX, newY, () => {
                    if (this.scene.player.x >= 576) {
                        this.scene.uiManager.showWinScreen(this.scene.player.score);
                        this.scene.winSound.play();
                        return;
                    }

                    // Check for collisions after movement
                    this.scene.entityManager.collisionManager.checkEntityCollisions(this.scene.entityManager, this.scene.player);
                    
                    if (!isAccelerating && !isStayingStill) {
                        this.scene.playerTurns++;
                        if (this.scene.playerTurns === 2 && !this.scene.entityManager.chickenSpawned) {
                            this.scene.entityManager.spawnChicken(this.scene.playerStartX, this.scene.playerStartY);
                        }
                        if (this.scene.playerTurns % 2 === 0) {
                            this.scene.entityManager.updateEntities(this.scene.player);
                        }
                        if (this.scene.playerTurns % 6 === 0 && Math.random() < 0.2) {
                            this.scene.entityManager.spawnEmergencyVehicle();
                        }
                    }

                    this.scene.time.delayedCall(250, () => {
                        this.isAnimating = false;
                    });
                });
            }
        });
    }
} 