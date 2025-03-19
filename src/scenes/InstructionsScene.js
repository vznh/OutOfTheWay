class InstructionsScene extends Phaser.Scene {
  constructor() {
    super("instructionsScene");
  }

  preload() {
    this.load.image("road", "assets/road.png");
  }

  create() {
    // Add the road background
    const road = this.add.image(320, 192, "road");
    road.setDisplaySize(640, 384);

    // Add title
    const titleText = this.add.text(320, 32, "Instructions", {
      fontSize: "48px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5);

    // Add point system
    const pointSystem = [
      "Point System:",
      "• Passing a car: +1 point",
      "• Passing a bus: +10 points",
      "• Explosion: +2 points",
      "• Police car collision: +20 points",
      "• Emergency vehicle collision: +30 points",
      "• Chicken collision: +50 points",
      "",
      "Entities:",
      "• Cars: Move randomly, avoid collisions",
      "• School Buses: Chase player, max 3 on map",
      "• Emergency Vehicles: Move left, clear their path!",
      "• Police Cars: Move left on top row, no gas allowed!",
      "• Chicken: Spawns after 2 moves, chases player",
      "",
      "Controls:",
      "• Arrow Keys: Move player",
      "• Spacebar: Use gas (move 2 spaces forward)",
      "• ESC: Return to menu",
      "",
      "Press ENTER to start game"
    ];

    // Create instruction text with proper spacing
    pointSystem.forEach((line, index) => {
      this.add.text(320, 96 + (index * 24), line, {
        fontSize: "20px",
        fill: "#ffffff",
        fontFamily: "Arial",
        backgroundColor: "#000000",
        padding: { x: 5, y: 2 },
        align: "center"
      }).setOrigin(0.5);
    });

    // Add ESC key handler
    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.start("menuScene");
    });

    // Add enter key handler
    this.input.keyboard.once("keydown-ENTER", () => {
      this.scene.start("playScene");
    });
  }
} 