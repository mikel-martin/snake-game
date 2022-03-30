const board = document.getElementById("board");
const context = board.getContext("2d");

const size = 20;
let speed = 150;

let gameOver = false;
let score = 0;

let dx = 0;
let dy = 0;

let snake = [
    {x: 200, y: 200},
    {x: 200, y: 180}
];
let snakeLength = snake.length;

let apple = { x: size, y: size };

// CANVAS

let clearCanvas = function() {
    context.fillStyle = "white";
    context.strokeStyle = "white";
    context.fillRect(0, 0, board.width, board.height);
    context.strokeRect(0, 0, board.width, board.height);
}

document.getElementById("reload").addEventListener("click", function() {
    location.reload()
});

// INPUT

document.addEventListener("keydown", function(event) {
    
    const key = event.keyCode;
    
    const goindLeft = dx === -size;
    const goindRight = dx === size;
    const goindUp = dy === -size;
    const goindDown = dy === size;

    if (key === 37 && !goindRight) { // LEFT
        dy = 0;
        dx = -size;
    }
    if (key === 38 && !goindDown) { // UP
        dy = -size;
        dx = 0;
    }
    if (key === 39 && !goindLeft) { // RIGHT
        dy = 0;
        dx = size;
    } 
    if (key === 40 && !goindUp) { // DOWN
        dy = size;
        dx = 0;
    }

});

// APPLE

let randomPosition = function(max, min) {
    return Math.floor((Math.random() * (max - min) + min) / size) * size;
}

let validPos = function(pos) {
    let filtered = snake.filter((part) => {
        return part.x === pos.x && part.y === pos.y;
    });
    return filtered.length === 0;
}

let moveApple = function() {
    
    let newPos = {
        x: randomPosition(0, board.width - size),
        y: randomPosition(0, board.height - size)
    }; 

    while (!validPos(newPos)) {
        newPos = {
            x: randomPosition(0, board.width - size),
            y: randomPosition(0, board.height - size)
        };
    }

    apple = newPos;

}

let drawApple = function() {
    context.fillStyle = "red";
    context.strokeStyle = "white";
    context.fillRect(apple.x, apple.y, size, size);
    context.strokeRect(apple.x, apple.y, size, size);
} 

// SNAKE

let drawSnake = function() {
    snake.forEach((part, index) => {
        index === 0 ? context.fillStyle = "darkgreen" : context.fillStyle = "green";
        context.strokeStyle = "white";
        context.fillRect(part.x, part.y, size, size);
        context.strokeRect(part.x, part.y, size, size);
    });
}

let moveSnake = function () {
    if (snakeLength != snake.length)
        snake.pop();
    snake.unshift({ x: snake[0].x + dx, y: snake [0].y + dy });
}

// DRAW GRID
let drawGrid = function() {
    for(let x = 0; x < board.width; x += size) {
        for(let y = 0; y < board.height; y += size) {
            context.fillStyle = "";
            context.strokeStyle = "lightgray";
            context.strokeRect(x, y, size, size);
        }
    }
}

// CHECK COLLISIONS

let checkCollisions = function() {

    // SNAKE HEAD WITH APPLE 
    if (snake[0].x === apple.x && snake[0].y === apple.y) {
        snakeLength += 1;
        score += 1;
        speed -= 3;
        moveApple();
        document.getElementById("score").innerHTML = "Score: " + score;
    }

    // CHECK HEAD COLLISION WITH TAIL
    for (let i = 4; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }

    // SNAKE OUT OF BOUNDS HORIZONTAL
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > board.width - size;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > board.height - size;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;

};

// GAME LOOP

moveApple();

let gameLoopId = setInterval(function() {
    clearCanvas();
    drawGrid();
    drawApple();
    drawSnake();
    moveSnake();
    gameOver = checkCollisions();
    if (gameOver) {
        dx = 0;
        dy = 0;
        clearInterval(gameLoopId);
        // location.reload();
    }
}, speed);