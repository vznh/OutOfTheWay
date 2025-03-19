// MenuScene.js
class MenuScene extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }

  preload() {
    // Load the road background
    this.load.image("road", "assets/road.png");
  }

  create() {
    // Stop all sounds and remove them from the sound manager
    this.sound.stopAll();
    this.sound.removeAll();

    // Add the road background (no rotation needed for landscape)
    const road = this.add.image(320, 192, "road"); // Center of the game area
    road.setDisplaySize(640, 384); // Full game size

    // Add title text
    const titleText = this.add.text(320, 64, "Out of the Way!", {
      fontSize: "48px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5);

    // Add menu options
    const menuOptions = [
      { text: "START", scene: "playScene" },
      { text: "INSTRUCTIONS", url: "https://github.com/vznh/OutOfTheWay/blob/master/instructions.md" },
      { text: "CREDITS", scene: "creditsScene" },
      { text: "GitHub", url: "https://github.com/vznh/OutOfTheWay" },
    ];

    // Create menu items with hover effects
    menuOptions.forEach((option, index) => {
      const y = 140 + index * 48; // Reduced base Y from 192 to 140, and spacing from 64 to 48
      const menuItem = this.add
        .text(320, y, option.text, {
          fontSize: "32px",
          fill: "#ffffff",
          fontFamily: "Arial",
          backgroundColor: "#000000",
          padding: { x: 10, y: 5 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      // Add hover effects
      menuItem.on("pointerover", () => {
        menuItem.setStyle({ fill: "#ff0000" });
      });

      menuItem.on("pointerout", () => {
        menuItem.setStyle({ fill: "#ffffff" });
      });

      // Add click handler
      menuItem.on("pointerdown", () => {
        // Store references to all created elements
        this.menuElements = {
          road,
          titleText,
          menuItems: menuOptions.map((_, i) => this.children.list.find(child => 
            child.type === 'Text' && 
            child.text === menuOptions[i].text
          ))
        };
        
        // If it's a URL, open in new tab, otherwise start the scene
        if (option.url) {
          window.open(option.url, '_blank');
        } else {
          this.scene.start(option.scene);
        }
      });
    });

    // Add ESC key handler to return to main menu
    this.input.keyboard.on("keydown-ESC", () => {
      // Stop all sounds and remove them from the sound manager
      this.sound.stopAll();
      this.sound.removeAll();

      // Destroy all menu elements if they exist
      if (this.menuElements) {
        this.menuElements.road.destroy();
        this.menuElements.titleText.destroy();
        this.menuElements.menuItems.forEach(item => item.destroy());
        this.menuElements = null;
      }
      this.scene.start("menuScene");
    });
  }

  update() {
    // No continuous updates needed
  }
}

class InstructionsScene extends Phaser.Scene {
  constructor() {
    super("instructionsScene");
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

class CreditsScene extends Phaser.Scene {
  constructor() {
    super("creditsScene");
  }

  create() {
    // Add the road background
    const road = this.add.image(320, 192, "road");
    road.setDisplaySize(640, 384);

    // Add credits text
    const creditsText = this.add.text(320, 192, "All assets were stock.", {
      fontSize: "24px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
      align: "center"
    }).setOrigin(0.5);

    // Add ESC instruction text
    const escText = this.add.text(620, 364, "Press ESC to return to Menu", {
      fontSize: "16px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#000000",
      padding: { x: 5, y: 2 },
    }).setOrigin(1);

    // Add ESC key handler
    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.start("menuScene");
    });
  }
}

class GitHubScene extends Phaser.Scene {
  constructor() {
    super("githubScene");
  }

  create() {
    // Add the road background
    const road = this.add.image(320, 192, "road");
    road.setDisplaySize(640, 384);

    // Add GitHub link text
    const githubText = this.add.text(320, 192, "https://github.com/vznh/OutOfTheWay", {
      fontSize: "24px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Add ESC instruction text
    const escText = this.add.text(620, 364, "Press ESC to return to Menu", {
      fontSize: "16px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#000000",
      padding: { x: 5, y: 2 },
    }).setOrigin(1);

    // Add click handler to open GitHub link
    githubText.on("pointerdown", () => {
      window.open('https://github.com/vznh/OutOfTheWay', '_blank');
    });

    // Add hover effects
    githubText.on("pointerover", () => {
      githubText.setStyle({ fill: "#ff0000" });
    });

    githubText.on("pointerout", () => {
      githubText.setStyle({ fill: "#ffffff" });
    });

    // Add ESC key handler
    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.start("menuScene");
    });
  }
}
