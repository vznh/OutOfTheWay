// GameScene.js
class GameScene extends Phaser.Scene {
  constructor() {
    super("playScene");
    this.playerTurns = 0;
  }

  preload() {
    this.load.image("road", "assets/road.png");
    this.load.image("player", "assets/peter.png");
    this.load.image("car", "assets/car.png");
    this.load.image("bus", "assets/bus.png");
    this.load.image("emergency", "assets/evehicle.png");
    this.load.image("pcar", "assets/pcar.png");
    this.load.image("chicken", "assets/chicken.png");
    this.load.spritesheet("explosion", "assets/explosion.png", { 
      frameWidth: 256, 
      frameHeight: 256 
    });
    this.load.audio("move", "assets/boop.mp3");
    this.load.audio("joeswanson", "assets/joeswanson.mp3");
    this.load.audio("handicapped", "assets/handicapped.mp3");
    this.load.audio("hooray", "assets/hooray.mp3");
    this.load.audio("policesiren", "assets/policesiren.mp3");
    this.load.audio("ambsiren", "assets/ambsiren.mp3");
    this.load.audio("bye", "assets/bye.mp3");
  }

  create() {
    const road = this.add.image(320, 192, "road");
    road.setDisplaySize(640, 384);

    const winZone = this.add.graphics();
    winZone.fillStyle(0x00ff00, 0.1);
    winZone.fillRect(576, 0, 64, 384);

    // Add ESC instruction text
    const escText = this.add.text(620, 364, "Press ESC to return to Menu", {
      fontSize: "16px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#000000",
      padding: { x: 5, y: 2 },
    }).setOrigin(1);

    // Create explosion animation
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: 0
    });

    // Initialize sounds
    this.winSound = this.sound.add('hooray', { loop: false, volume: 0.7 });
    this.moveSound = this.sound.add('move', { loop: false, volume: 0.5 });
    this.policeSound = this.sound.add('joeswanson', { loop: false, volume: 0.5 });
    this.emergencySound = this.sound.add('handicapped', { loop: false, volume: 0.5 });

    const randomLane = Phaser.Math.Between(0, 5);
    const startX = 32;
    const startY = 32 + randomLane * 64;

    this.playerStartX = startX;
    this.playerStartY = startY;

    // Initialize managers
    this.uiManager = new UIManager(this);
    this.collisionManager = new CollisionManager(this, this.uiManager);
    this.entityManager = new EntityManager(this, this.collisionManager);
    this.inputManager = new InputManager(this);

    // Create player
    this.player = new Player(this, startX, startY);

    // Initialize game state
    this.entityManager.spawnInitialEntities();
    this.inputManager.setupKeyboardInput();
    this.uiManager.updateScoreDisplay(this.player.score);
    this.uiManager.updateGasDisplay(this.player.gas);

    // Add ESC key handler
    this.input.keyboard.on('keydown-ESC', () => {
      // Stop all sounds
      this.sound.stopAll();
      
      // Stop all tweens
      this.tweens.killAll();
      
      // Clear all entities
      if (this.entityManager) {
        this.entityManager.cars.forEach(car => car.destroy());
        this.entityManager.buses.forEach(bus => bus.destroy());
        this.entityManager.emergencyVehicles.forEach(ev => ev.destroy());
        this.entityManager.policeCars.forEach(police => police.destroy());
        if (this.entityManager.chicken) {
          this.entityManager.chicken.destroy();
        }
      }
      
      // Destroy player
      if (this.player) {
        this.player.destroy();
      }
      
      // Switch to menu scene
      this.scene.start('menuScene');
    });
  }
}
