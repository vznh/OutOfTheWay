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
    }

    spawnInitialEntities() {
        // Spawn 3 buses
        for (let i = 0; i < 3; i++) {
            this.spawnNewBus();
        }
        // Spawn 3 cars
        for (let i = 0; i < 3; i++) {
            this.spawnNewCar();
        }
    }

    spawnNewCar() {
        let x, y;
        do {
            x = 32 + Math.floor(Math.random() * 9) * 64;
            y = 32 + Math.floor(Math.random() * 6) * 64;
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

    updateEntities(player) {
        this.updateCarPositions();
        this.updateBusPositions();
        this.updatePoliceCarTurns();
        this.moveEmergencyVehicles(); // Move emergency vehicles on each player turn
        
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
        this.collisionManager.checkEntityCollisions(this, player);

        // Chance to spawn police car on update
        this.spawnPoliceCar();

        // Increased chance to spawn emergency vehicle (from 20% to 30%)
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
        this.cars.forEach(car => {
            const newPos = car.randomMove();
            if (!this.collisionManager.isPositionOccupied(newPos.x, newPos.y, this)) {
                car.moveCar(newPos.x, newPos.y);
            }
        });

        // Respawn cars if needed
        while (this.cars.length < 3) {
            this.spawnNewCar();
        }
    }

    updateBusPositions() {
        this.buses.forEach(bus => {
            const newPos = bus.chasePlayer(this.scene.player);
            if (!this.collisionManager.isPositionOccupied(newPos.x, newPos.y, this)) {
                bus.moveBus(newPos.x, newPos.y);
            }
        });

        // Respawn buses if needed
        while (this.buses.length < 3) {
            this.spawnNewBus();
        }
    }
} 