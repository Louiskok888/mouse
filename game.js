const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// Create Start Button
const startButton = document.createElement("button");
startButton.textContent = "Start Game";
startButton.style.position = "absolute";
startButton.style.left = "50%";
startButton.style.transform = "translateX(-50%)";
startButton.style.fontSize = "20px";
startButton.style.padding = "10px 20px";
startButton.style.zIndex = "10"; // To ensure the button is above the canvas
startButton.style.top = "20px"; // Positioned at the top of the screen initially
document.body.appendChild(startButton);

let scorePlayer1 = 0;
let scorePlayer2 = 0;
let timeLeft = 30; // Game duration in seconds
let fruits = [];
let cursorPlayer1 = { x: canvas.width / 4, y: canvas.height / 2 }; // Player 1 cursor position
let cursorPlayer2 = { x: (canvas.width / 4) * 3, y: canvas.height / 2 }; // Player 2 cursor position
let speed = 5; // Speed of automatic movement
let dx1 = 0, dy1 = 0; // Direction for Player 1
let dx2 = 0, dy2 = 0; // Direction for Player 2
let cursorRadius = 10; // Radius for both cursors

// Function to resize canvas to fit the entire screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Generate random colors
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Generate a random fruit
function createFruit() {
    return {
        x: Math.random() * (canvas.width - 20) + 10,
        y: Math.random() * (canvas.height - 20) + 10,
        radius: 10,
        color: getRandomColor()
    };
}

// Generate initial fruits
function spawnFruits() {
    for (let i = 0; i < 10; i++) {
        fruits.push(createFruit());
    }
}

// Handle touch events to control player movement
canvas.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    // Player 1 (left side of screen)
    if (x < canvas.width / 2) {
        cursorPlayer1.x = x;
        cursorPlayer1.y = y;
    }
    // Player 2 (right side of screen)
    else {
        cursorPlayer2.x = x;
        cursorPlayer2.y = y;
    }
});

// Check collision with fruits for both players
function checkCollisions() {
    fruits = fruits.filter(fruit => {
        // Check collision with Player 1's cursor
        const dist1 = Math.hypot(fruit.x - cursorPlayer1.x, fruit.y - cursorPlayer1.y);
        if (dist1 < fruit.radius + cursorRadius) {
            scorePlayer1++;
            return false;
        }

        // Check collision with Player 2's cursor
        const dist2 = Math.hypot(fruit.x - cursorPlayer2.x, fruit.y - cursorPlayer2.y);
        if (dist2 < fruit.radius + cursorRadius) {
            scorePlayer2++;
            return false;
        }

        return true;
    });

    if (fruits.length < 10) {
        fruits.push(createFruit());
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Player 1's cursor (blue)
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(cursorPlayer1.x, cursorPlayer1.y, cursorRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Player 2's cursor (green)
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(cursorPlayer2.x, cursorPlayer2.y, cursorRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw fruits
    fruits.forEach(fruit => {
        ctx.fillStyle = fruit.color;
        ctx.beginPath();
        ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Player 1 Score: " + scorePlayer1, 10, 30);
    ctx.fillText("Player 2 Score: " + scorePlayer2, 10, 60);
    ctx.fillText("Time Left: " + timeLeft, 10, 90);
}

// Update game logic
function update() {
    if (timeLeft > 0) {
        checkCollisions();
        draw();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2 - 30);
        ctx.fillText("Player 1 Score: " + scorePlayer1, canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText("Player 2 Score: " + scorePlayer2, canvas.width / 2 - 100, canvas.height / 2 + 30);

        // Show start button below the score after game over
        startButton.style.display = "block";
        startButton.style.top = canvas.height / 2 + 50 + "px"; // Position the start button below the scores
        return;
    }
    requestAnimationFrame(update);
}

// Countdown timer
setInterval(() => {
    if (timeLeft > 0) {
        timeLeft--;
    }
}, 1000);

// Start game function
function startGame() {
    // Hide the start button
    startButton.style.display = "none";
    
    // Reset game variables
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    timeLeft = 30;
    fruits = [];
    cursorPlayer1 = { x: canvas.width / 4, y: canvas.height / 2 };
    cursorPlayer2 = { x: (canvas.width / 4) * 3, y: canvas.height / 2 };
    spawnFruits();
    update();
}

// Add event listener to the Start button
startButton.addEventListener("click", startGame);

// Resize canvas whenever the window size changes
window.addEventListener("resize", resizeCanvas);

// Initial canvas resize
resizeCanvas();
