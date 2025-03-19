class CreditsScene extends Phaser.Scene {
  constructor() {
    super("creditsScene");
  }

  preload() {
    // Load the road background
    this.load.image("road", "assets/road.png");
  }

  create() {
    // Add the road background
    const road = this.add.image(320, 192, "road");
    road.setDisplaySize(640, 384);

    // Add credits text
    const creditsText = this.add.text(320, 192, "All assets were stock and audio assets provided by Seth McFarlane.", {
      fontSize: "24px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
      align: "center"
    }).setOrigin(0.5);

    // Add ESC key handler
    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.start("menuScene");
    });
  }
} 