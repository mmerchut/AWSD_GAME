const gameArea = document.getElementById("gameArea"); // Get the game area element
const player = document.getElementById("player"); // Get the player element
const goal = document.getElementById("goal"); // Get the goal element
const resetButton = document.getElementById("resetButton"); // Get the reset button

let playerPosition = { x: 5, y: 5 }; // Initialize the player's starting position
const obstacles = []; // Array to hold the positions of obstacles
const obstacleCount = 5; // Number of obstacles to generate

// Function to generate a random position within specified bounds
function getRandomPosition(maxX, maxY) {
    return {
        x: Math.floor(Math.random() * maxX), // Generate random x-coordinate
        y: Math.floor(Math.random() * maxY)  // Generate random y-coordinate
    };
}

// Function to generate obstacles in the game area
function generateObstacles() {
    // Remove any existing obstacles from the game area
    const existingObstacles = document.querySelectorAll(".obstacle");
    existingObstacles.forEach(obstacle => gameArea.removeChild(obstacle));
    obstacles.length = 0; // Reset the obstacles array

    // Create obstacles
    for (let i = 0; i < obstacleCount; i++) {
        const obstacle = document.createElement("div"); // Create a new obstacle element
        obstacle.classList.add("obstacle"); // Add the obstacle class
        let position;

        // Ensure the obstacle doesn't overlap with existing obstacles or the player
        do {
            position = getRandomPosition(60, 40); // Generate random position
        } while (isColliding(position, obstacles) || (position.x === playerPosition.x && position.y === playerPosition.y));

        // Position the obstacle in the game area
        obstacle.style.top = position.y * 10 + "px"; // Set vertical position
        obstacle.style.left = position.x * 10 + "px"; // Set horizontal position
        gameArea.appendChild(obstacle); // Add the obstacle to the game area
        obstacles.push(position); // Store the position in the obstacles array
    }
}

// Function to generate the goal in the game area
function generateGoal() {
    let position;
    // Ensure the goal doesn't overlap with obstacles or the player
    do {
        position = getRandomPosition(60, 40); // Generate random position
    } while (isColliding(position, obstacles) || (position.x === playerPosition.x && position.y === playerPosition.y));

    // Position the goal in the game area
    goal.style.top = position.y * 10 + "px"; // Set vertical position
    goal.style.left = position.x * 10 + "px"; // Set horizontal position
}

// Function to update the player's position on the screen
function drawPlayer() {
    player.style.top = playerPosition.y * 10 + "px"; // Update vertical position
    player.style.left = playerPosition.x * 10 + "px"; // Update horizontal position
}

// Function to check for collisions with the goal and obstacles
function checkCollision() {
    const playerRect = player.getBoundingClientRect(); // Get the player's bounding rectangle
    const goalRect = goal.getBoundingClientRect(); // Get the goal's bounding rectangle

    // Check for collision with the goal
    if (
        playerRect.x < goalRect.x + goalRect.width &&
        playerRect.x + playerRect.width > goalRect.x &&
        playerRect.y < goalRect.y + goalRect.height &&
        playerRect.y + playerRect.height > goalRect.y
    ) {
        alert("Congratulations! You've reached the goal!"); // Alert the player
        resetGame(); // Reset the game
    }

    // Check for collision with obstacles
    for (let obstacle of obstacles) {
        const obstacleRect = {
            x: obstacle.x * 10,
            y: obstacle.y * 10,
            width: 30, // Width of the obstacle
            height: 30 // Height of the obstacle
        };
        if (
            playerRect.x < obstacleRect.x + obstacleRect.width &&
            playerRect.x + playerRect.width > obstacleRect.x &&
            playerRect.y < obstacleRect.y + obstacleRect.height &&
            playerRect.y + playerRect.height > obstacleRect.y
        ) {
            alert("Game Over! You hit an obstacle!"); // Alert on hitting an obstacle
            resetGame(); // Reset the game
        }
    }
}

// Function to reset the game state
function resetGame() {
    playerPosition = { x: 5, y: 5 }; // Reset player position to starting point
    generateObstacles(); // Generate new obstacles
    generateGoal(); // Generate new goal
    drawPlayer(); // Update the display of the player
}

// Helper function to check if a new position collides with existing obstacles
function isColliding(position, obstacles) {
    return obstacles.some(obstacle => obstacle.x === position.x && obstacle.y === position.y); // Check for any overlapping positions
}

// Function to handle player movement based on keyboard input
function movePlayer(event) {
    let newPosition = { ...playerPosition }; // Create a copy of the current player position

    // Determine the new position based on the key pressed
    switch (event.key) {
        case "w": // Move up
            newPosition.y--;
            break;
        case "a": // Move left
            newPosition.x--;
            break;
        case "s": // Move down
            newPosition.y++;
            break;
        case "d": // Move right
            newPosition.x++;
            break;
    }

    // Check for collision before updating the position
    if (!isColliding(newPosition, obstacles) && newPosition.x >= 0 && newPosition.x < 60 && newPosition.y >= 0 && newPosition.y < 40) {
        playerPosition = newPosition; // Update player position
        drawPlayer(); // Update player's position on the screen
        checkCollision(); // Check for collisions
    }
}

// Initialize the game
generateObstacles(); // Generate initial obstacles
generateGoal(); // Generate the goal
drawPlayer(); // Draw player at starting position

// Set up event listeners for player movement and reset button
window.addEventListener("keydown", movePlayer); // Listen for key presses to move the player
resetButton.addEventListener("click", resetGame); // Listen for reset button click
