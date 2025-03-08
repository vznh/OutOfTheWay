class MenuScene extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.add
      .text(centerX, centerY - 60, "Out Of The Way", {
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const startButton = this.add
      .text(centerX, centerY, "Start", {
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startButton.on("pointerdown", () => {
      this.scene.start("playScene");
    });

    const creditsButton = this.add
      .text(centerX, centerY + 60, "Credits", {
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    creditsButton.on("pointerdown", () => {
      // temp
      console.log(
        "Credits button pressed - functionality not implemented yet.",
      );
    });
  }
}
