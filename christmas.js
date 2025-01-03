const canvas = document.getElementById("christmasCanvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const width = canvas.width;
    const height = canvas.height;

    const snowflakes = [];
    const treeLights = [];
    let santaX = -300;
    let santaY = height * 0.2; 
    let santaDirection = 1; 
    const treeHeight = 300; 

    // Snowflake class
    class Snowflake {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.drift = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.8 + 0.2;
      }

      update() {
        this.y += this.speed;
        this.x += this.drift;
        if (this.y > height) {
          this.y = 0;
          this.x = Math.random() * width;
        }
        if (this.x > width || this.x < 0) {
          this.x = Math.random() * width;
        }
      }

      draw() {
        const points = 6;
        const radius = this.radius * 2; 
        const step = Math.PI / points;

        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        for (let i = 0; i < 2 * points; i++) {
          const angle = i * step;
          const r = i % 2 === 0 ? radius : radius / 2;
          const x = this.x + r * Math.cos(angle);
          const y = this.y + r * Math.sin(angle);
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Tree Light class
    class TreeLight {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.pulse = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.opacity += this.pulse;
        if (this.opacity >= 1 || this.opacity <= 0.5) this.pulse *= -1;
      }

      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;
      }
    }

    // Draw Christmas tree
    function drawTree() {
      const treeX = width / 2; 
      const treeBaseY = height * 0.90;
      const treeWidth = 200; 
      const treeHeight = 300; 

      // Draw the tree trunk first
      const trunkWidth = 40;
      const trunkHeight = 50;
      ctx.fillStyle = "#8B4513"; 
      ctx.fillRect(treeX - trunkWidth / 2, treeBaseY, trunkWidth, trunkHeight);

      // Draw the 3 triangular layers of the tree
      ctx.fillStyle = "#0A5329"; 
      for (let i = 0; i < 3; i++) {
          const layerHeight = treeHeight / 3; 
          const layerY = treeBaseY - (i + 1) * layerHeight;
          const layerWidth = treeWidth - i * 40; 

          ctx.beginPath();
          ctx.moveTo(treeX, layerY); 
          ctx.lineTo(treeX - layerWidth / 2, layerY + layerHeight); 
          ctx.lineTo(treeX + layerWidth / 2, layerY + layerHeight);
          ctx.closePath();
          ctx.fill();
      }

      // Draw the lights on the tree
      treeLights.forEach((light) => light.update());
      treeLights.forEach((light) => light.draw());
    }

    // Load Santa Image once globally
    const santaImage = new Image();
    santaImage.src = "santa.png"; 
    let santaImageLoaded = false;

    santaImage.onload = () => {
      santaImageLoaded = true;
    };

    // Draw Santa Claus
    function drawSanta() {
      if (santaImageLoaded) {
        ctx.drawImage(santaImage, santaX, santaY, 350, 350); 
      }
    }

    // Draw Merry Christmas text
    function drawText() {
      ctx.save();
      ctx.font = "bold 70px Arial";
      ctx.fillStyle = "#FFD700";
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 20;
      ctx.textAlign = "center";
      ctx.fillText("Merry Christmas", width / 2, height * 0.1);
      ctx.restore();
    }

    // Create initial snowflakes
    function createSnowflakes(count) {
      for (let i = 0; i < count; i++) {
        snowflakes.push(new Snowflake());
      }
    }

    // Create tree lights with proper positioning
    function createTreeLights() {
      const treeX = width / 2;
      const treeBaseY = height * 0.9; 
      const treeWidth = 200; 
      const treeHeight = 300; 

      treeLights.length = 0; 

      // Add lights to all layers of the tree
      const numLights = 100; 
      for (let i = 0; i < numLights; i++) {
          const randomLayer = Math.random() * treeHeight;
          const y = treeBaseY - randomLayer; 

          // Width narrows as we go up the tree
          const layerWidth = treeWidth * (1 - randomLayer / treeHeight); 
          const xOffset = Math.random() * layerWidth - layerWidth / 2; 
          const x = treeX + xOffset;

          // Randomize the light color
          const colors = ["red", "yellow", "blue", "green", "purple"];
          const color = colors[Math.floor(Math.random() * colors.length)];

          treeLights.push(new TreeLight(x, y, color));
      }
    }

    // Update all elements
    function updateScene() {
      snowflakes.forEach((snowflake) => snowflake.update());
      treeLights.forEach((light) => light.update());

      // Vertical oscillation for Santa
      santaY += santaDirection * 2; 
      if (santaY > height * 0.8 - 100 || santaY < height * 0.2) {
        santaDirection *= -1; 
      }

      santaX += 2; 
      if (santaX > width + 100) santaX = -300;
    }

    // Draw all elements
    function drawScene() {
      ctx.clearRect(0, 0, width, height);

      // Background fade
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, width, height);

      drawText();
      drawTree();
      drawSanta();

      snowflakes.forEach((snowflake) => snowflake.draw());
    }

    // Animation loop
    function animate() {
      updateScene();
      drawScene();
      requestAnimationFrame(animate);
    }

    // Initialize
    createSnowflakes(100);
    createTreeLights();
    animate();

    // Handle window resize
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      snowflakes.length = 0; 
      treeLights.length = 0; 
      createSnowflakes(100);
      createTreeLights();
    });

    const audio = document.getElementById('christmasSound');

    function playAudio() {
      audio.play().catch(() => {
        // Retry playing the audio if it is blocked
        document.body.addEventListener('click', () => {
          audio.play();
        }, { once: true });
      });
    }

    // Trigger audio playback automatically
    window.addEventListener('load', playAudio);
