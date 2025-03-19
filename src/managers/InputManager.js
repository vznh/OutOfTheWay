// InputManager.js
class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.isAnimating = false;
        this.lastDirection = null; // Tracks last movement direction for gas usage
        this.lastPlayerPosition = { x: 0, y: 0 }; // Track last safe position
    }

    setupKeyboardInput() {
        this.scene.input.keyboard.on("keydown", (event) => {
            if (this.isAnimating) return;

            let newX = this.scene.player.x;
            let newY = this.scene.player.y;
            let isStayingStill = false;
            let isAccelerating = false;
            let direction = null;

            // Store current position before movement
            this.lastPlayerPosition = { x: this.scene.player.x, y: this.scene.player.y };

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

                    if (!isAccelerating && !isStayingStill) {
                        this.scene.playerTurns++;
                        if (this.scene.playerTurns === 2 && !this.scene.entityManager.chickenSpawned) {
                            this.scene.entityManager.spawnChicken(this.scene.playerStartX, this.scene.playerStartY);
                        }
                        if (this.scene.playerTurns % 2 === 0) {
                            // Handle bus collisions by providing a callback
                            this.scene.entityManager.updateEntities(this.scene.player, () => {
                                // Move player back to last safe position if bus collision occurs
                                this.scene.player.movePlayer(this.lastPlayerPosition.x, this.lastPlayerPosition.y, () => {
                                    this.scene.uiManager.showWarningText("A bus blocked your path!");
                                });
                            });
                        }
                        if (this.scene.playerTurns % 6 === 0 && Math.random() < 0.3) {
                            this.scene.entityManager.spawnEmergencyVehicle();
                        }
                    }

                    // Check for collisions after movement
                    this.scene.entityManager.collisionManager.checkEntityCollisions(this.scene.entityManager, this.scene.player);

                    this.scene.time.delayedCall(250, () => {
                        this.isAnimating = false;
                    });
                });
            }
        });
    }
} 