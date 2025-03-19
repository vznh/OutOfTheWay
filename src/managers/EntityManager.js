// EntityManager.js
class EntityManager {
    constructor(scene, collisionManager) {
        this.scene = scene;
        this.collisionManager = collisionManager;
        
        this.cars = [];
        this.buses = [];
        this.emergencyVehicles = [];
        this.policeCars = [];
        this.chicken = null;
        this.chickenSpawned = false;
        this.maxCars = 10; // Maximum number of cars allowed
        
        // Track last positions to detect passing
        this.lastPlayerPos = null;
    }

    spawnInitialEntities() {
        // Spawn 3 buses
        for (let i = 0; i < 3; i++) {
            this.spawnNewBus();
        }
        // Spawn initial 3 cars
        for (let i = 0; i < 3; i++) {
            this.spawnNewCar();
        }
    }

    spawnNewCar() {
        if (this.cars.length >= this.maxCars) return; // Don't spawn if at max capacity

        let x, y;
        let attempts = 0;
        const maxAttempts = 20; // Prevent infinite loops

        do {
            x = 32 + Math.floor(Math.random() * 9) * 64;
            y = 32 + Math.floor(Math.random() * 6) * 64;
            attempts++;
            if (attempts >= maxAttempts) return; // Give up if can't find valid position
        } while (
            this.collisionManager.isPositionOccupied(x, y, this) ||
            Math.abs(x - this.scene.player.x) < 128 ||
            Math.abs(y - this.scene.player.y) < 128
        );

        const car = new Car(this.scene, x, y);
        this.cars.push(car);
    }

    spawnNewBus() {
        if (this.buses.length >= 3) return;

        let x, y;
        do {
            x = 32 + Math.floor(Math.random() * 9) * 64;
            y = 32 + Math.floor(Math.random() * 6) * 64;
        } while (
            this.collisionManager.isPositionOccupied(x, y, this) ||
            Math.abs(x - this.scene.player.x) < 128 ||
            Math.abs(y - this.scene.player.y) < 128
        );

        const bus = new Bus(this.scene, x, y);
        this.buses.push(bus);
    }

    spawnEmergencyVehicle() {
        if (this.emergencyVehicles.length >= 2) return;

        const y = 32 + Math.floor(Math.random() * 6) * 64;
        const emergency = new EmergencyVehicle(this.scene, -64, y); // Start from left side
        this.emergencyVehicles.push(emergency);
        this.scene.sound.play('ambsiren');
        emergency.createDangerZone();
    }

    moveEmergencyVehicles() {
        this.emergencyVehicles.forEach(ev => {
            ev.moveEmergency(() => {
                const index = this.emergencyVehicles.indexOf(ev);
                if (index > -1) {
                    this.emergencyVehicles.splice(index, 1);
                }
            });
        });
    }

    spawnPoliceCar() {
        if (this.policeCars.length >= 1) return; // Only one police car at a time
        
        if (Math.random() < 0.15) { // Reduced from 30% to 15% chance to spawn police car
            // Generate random grid position
            let x, y;
            do {
                x = 32 + Math.floor(Math.random() * 9) * 64;
                y = 32 + Math.floor(Math.random() * 6) * 64;
            } while (
                this.collisionManager.isPositionOccupied(x, y, this) ||
                Math.abs(x - this.scene.player.x) < 128 // Don't spawn too close to player
            );
            
            const police = new PoliceCar(this.scene, x, y);
            this.policeCars.push(police);
            this.scene.sound.play('policesiren');
        }
    }

    spawnChicken(startX, startY) {
        this.chicken = new Chicken(this.scene, startX, startY);
        this.chickenSpawned = true;
    }

    checkPassingRewards(player) {
        if (!this.lastPlayerPos) {
            this.lastPlayerPos = { x: player.x, y: player.y };
            return 0;
        }

        let totalPoints = 0;
        const oldX = this.lastPlayerPos.x;
        const oldY = this.lastPlayerPos.y;
        const newX = player.x;
        const newY = player.y;

        // Helper function to check if player passed an entity
        const didPass = (entityX, entityY) => {
            // Check if player is adjacent to entity (up, right, or down)
            const isAdjacent = (
                // Up position
                (Math.abs(entityX - newX) === 0 && newY === entityY - 64) ||
                // Right position
                (newX === entityX + 64 && Math.abs(entityY - newY) === 0) ||
                // Down position
                (Math.abs(entityX - newX) === 0 && newY === entityY + 64)
            );

            // Check if player was previously behind or at the entity
            const wasNotInFront = oldX <= entityX;

            // Return true if player is adjacent and wasn't previously in front
            return isAdjacent && wasNotInFront;
        };

        // Check cars (+1 each)
        this.cars.forEach(car => {
            if (didPass(car.x, car.y)) {
                totalPoints += 1;
                this.scene.sound.play('bye');
            }
        });

        // Check buses (+10 each)
        this.buses.forEach(bus => {
            if (didPass(bus.x, bus.y)) {
                totalPoints += 10;
                this.scene.sound.play('bye');
            }
        });

        // Check police cars (+5 each)
        this.policeCars.forEach(police => {
            if (didPass(police.x, police.y)) {
                totalPoints += 5;
                this.scene.sound.play('bye');
            }
        });

        // Check emergency vehicles (+20 for successful avoidance)
        this.emergencyVehicles.forEach(ev => {
            if (didPass(ev.x, ev.y) && !ev.isDangerousPosition(newX, newY)) {
                totalPoints += 20;
                this.scene.sound.play('bye');
            }
        });

        // Update last position for next check
        this.lastPlayerPos = { x: newX, y: newY };

        // If no points were earned, deduct 1 point
        if (totalPoints === 0) {
            totalPoints = -1;
        }

        return totalPoints;
    }

    updateEntities(player, onCollision = null) {
        // Update player score based on passing rewards
        const pointsEarned = this.checkPassingRewards(player);
        player.score += pointsEarned;
        
        const carCollision = this.updateCarPositions();
        const busCollision = this.updateBusPositions();
        
        if ((carCollision || busCollision) && onCollision) {
            player.score += 10; // +10 for causing explosion
            onCollision();
            return;
        }
        
        this.updatePoliceCarTurns();
        this.moveEmergencyVehicles();
        
        if (this.chicken) {
            const newPos = this.chicken.chasePlayer(player);
            if (!this.collisionManager.isPositionOccupied(newPos.x, newPos.y, this)) {
                this.chicken.moveChicken(newPos.x, newPos.y, () => {
                    if (this.chicken.x === player.x && this.chicken.y === player.y) {
                        this.scene.uiManager.showFailScreen('The chicken got you!', player.score);
                    }
                });
            }
        }

        // Chance to spawn police car on update
        this.spawnPoliceCar();

        // Spawn new car every 2 turns if below max
        if (this.scene.playerTurns % 2 === 0 && this.cars.length < this.maxCars) {
            this.spawnNewCar();
        }

        // Increased chance to spawn emergency vehicle
        if (this.scene.playerTurns % 6 === 0 && Math.random() < 0.3) {
            this.spawnEmergencyVehicle();
        }

        // Update emergency vehicle danger zones
        this.emergencyVehicles.forEach(ev => ev.updateDangerZone());
    }

    updatePoliceCarTurns() {
        // Process police cars in reverse to safely remove them
        for (let i = this.policeCars.length - 1; i >= 0; i--) {
            if (this.policeCars[i].updateTurnCount()) {
                this.policeCars[i].destroy();
                this.policeCars.splice(i, 1);
            }
        }
    }

    updateCarPositions() {
        let carCollisionOccurred = false;
        
        this.cars.forEach(car => {
            const newPos = car.randomMove();
            const oldPos = { x: car.x, y: car.y };
            
            if (!this.collisionManager.isPositionOccupied(newPos.x, newPos.y, this)) {
                car.moveCar(newPos.x, newPos.y, () => {
                    // Check if car moved into player's position
                    if (car.x === this.scene.player.x && car.y === this.scene.player.y) {
                        carCollisionOccurred = true;
                        // Move car back to its old position
                        car.moveCar(oldPos.x, oldPos.y);
                    }
                });
            }
        });

        return carCollisionOccurred;
    }

    updateBusPositions() {
        let busCollisionOccurred = false;
        
        this.buses.forEach(bus => {
            const newPos = bus.chasePlayer(this.scene.player);
            const oldPos = { x: bus.x, y: bus.y };
            
            if (!this.collisionManager.isPositionOccupied(newPos.x, newPos.y, this)) {
                bus.moveBus(newPos.x, newPos.y, () => {
                    // Check if bus moved into player's position
                    if (bus.x === this.scene.player.x && bus.y === this.scene.player.y) {
                        busCollisionOccurred = true;
                        // Move bus back to its old position
                        bus.moveBus(oldPos.x, oldPos.y);
                    }
                });
            }
        });

        // Respawn buses if needed
        while (this.buses.length < 3) {
            this.spawnNewBus();
        }

        return busCollisionOccurred;
    }
} 