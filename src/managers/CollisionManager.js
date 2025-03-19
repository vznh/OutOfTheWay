// CollisionManager.js
class CollisionManager {
  /**
   * Manages all entity collisions in the game.
   *
   * constructor: Initializes with scene and UI manager.
   * isPositionOccupied: Checks if a position has any entity.
   * checkEntityCollisions: Checks all entity collisions with player.
   * checkCarCollisions: Detects collisions between cars and player.
   * checkBusCollisions: Detects collisions between buses and player.
   * checkEmergencyVehicleCollisions: Handles emergency vehicle interaction logic.
   * processEmergencyVehiclePath: Removes entities in emergency vehicle path.
   * checkPoliceCarCollisions: Detects police car and player collisions.
   * checkChickenCollision: Detects chicken and player collision.
   */
  constructor(scene, uiManager) {
    this.scene = scene;
    this.uiManager = uiManager;
  }

  isPositionOccupied(x, y, entities) {
    return (
      entities.cars.some(car => car.x === x && car.y === y) ||
      entities.buses.some(bus => bus.x === x && bus.y === y) ||
      entities.emergencyVehicles.some(ev => ev.x === x && ev.y === y) ||
      entities.policeCars.some(pc => pc.x === x && pc.y === y) ||
      (entities.chicken && entities.chicken.x === x && entities.chicken.y === y)
    );
  }

  checkEntityCollisions(entities, player) {
    if (this.checkCarCollisions(entities.cars, player)) return;
    if (this.checkBusCollisions(entities.buses, player)) return;
    if (this.checkEmergencyVehicleCollisions(entities.emergencyVehicles, entities, player)) return;
    if (this.checkPoliceCarCollisions(entities.policeCars, player)) return;
    if (entities.chicken) {
      this.checkChickenCollision(entities.chicken, player);
    }
  }

  checkCarCollisions(cars, player) {
    for (const car of cars) {
      if (car.x === player.x && car.y === player.y) {
        this.uiManager.createExplosion(car.x, car.y);
        this.uiManager.showFailScreen('Check your mirrors.', player.score);
        return true;
      }
    }
    return false;
  }

  checkBusCollisions(buses, player) {
    for (const bus of buses) {
      if (bus.x === player.x && bus.y === player.y) {
        this.uiManager.createExplosion(bus.x, bus.y);
        this.uiManager.showFailScreen('Check your mirrors.', player.score);
        return true;
      }
    }
    return false;
  }

  checkEmergencyVehicleCollisions(emergencyVehicles, entities, player) {
    for (const ev of emergencyVehicles) {
      if (ev.isDangerousPosition(player.x, player.y)) {
        this.uiManager.createExplosion(player.x, player.y);
        this.scene.sound.play('handicapped');
        this.uiManager.showFailScreen('Dickhead.', player.score);
        return true;
      }

      this.processEmergencyVehiclePath(ev, entities);
    }
    return false;
  }

  processEmergencyVehiclePath(ev, entities) {
    for (let i = entities.cars.length - 1; i >= 0; i--) {
      const car = entities.cars[i];
      if (ev.isDangerousPosition(car.x, car.y)) {
        this.uiManager.createExplosion(car.x, car.y);
        car.destroy();
        entities.cars.splice(i, 1);
      }
    }

    for (let i = entities.buses.length - 1; i >= 0; i--) {
      const bus = entities.buses[i];
      if (ev.isDangerousPosition(bus.x, bus.y)) {
        this.uiManager.createExplosion(bus.x, bus.y);
        bus.destroy();
        entities.buses.splice(i, 1);
      }
    }

    for (let i = entities.policeCars.length - 1; i >= 0; i--) {
      const pc = entities.policeCars[i];
      if (ev.isDangerousPosition(pc.x, pc.y)) {
        this.uiManager.createExplosion(pc.x, pc.y);
        pc.destroy();
        entities.policeCars.splice(i, 1);
      }
    }

    if (entities.chicken && ev.isDangerousPosition(entities.chicken.x, entities.chicken.y)) {
      this.uiManager.createExplosion(entities.chicken.x, entities.chicken.y);
      entities.chicken.destroy();
      entities.chicken = null;
      entities.chickenSpawned = false;
    }
  }

  checkPoliceCarCollisions(policeCars, player) {
    for (const pc of policeCars) {
      if (pc.x === player.x && pc.y === player.y) {
        this.uiManager.createExplosion(pc.x, pc.y);
        this.scene.sound.play('joeswanson');
        this.uiManager.showFailScreen('Gotcha.', player.score);
        return true;
      }
    }
    return false;
  }

  checkChickenCollision(chicken, player) {
    if (chicken.x === player.x && chicken.y === player.y) {
      this.uiManager.createExplosion(chicken.x, chicken.y);
      this.uiManager.showFailScreen('Fuck you Peter.', player.score);
      return true;
    }
    return false;
  }
}
