const board = document.querySelector('.board');
const scoreDisplay = document.querySelector('#score');
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;

let xDirection = 2;
let yDirection = 2;
let timerId;
let score = 0;

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;


// block
class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    }
}

// blocks
const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
];
drawBlocks();

// user
const user = document.createElement('div');
user.classList.add('user');
board.appendChild(user);
drawUser();

// ball
const ball = document.createElement('div');
ball.classList.add('ball');
board.appendChild(ball);
drawBall();

function drawBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.left = blocks[i].bottomLeft[0] + 'px';
        block.style.bottom = blocks[i].bottomLeft[1] + 'px';
        board.appendChild(block);
    }
}

function drawUser() {
    user.style.left = currentPosition[0] + 'px';
    user.style.bottom = currentPosition[1] + 'px';
}

function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

// move user
function moveUser(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 0) {
                currentPosition[0] -= 10;
                drawUser();
            }
            break;
        case 'ArrowRight':
            if (currentPosition[0] < (boardWidth - blockWidth)) {
                currentPosition[0] += 10;
                drawUser();
            }
            break;
    }
}
document.addEventListener('keydown', moveUser);

// move ball
function moveBall() {
    // wall hits
    if (ballCurrentPosition[0] >= (boardWidth - ballDiameter)
        || ballCurrentPosition[0] <= 0
        || ballCurrentPosition[1] >= (boardHeight - ballDiameter))
    {
        console.log('wall hit')
        changeDirection();
    }
    if (ballCurrentPosition[1] + ballDiameter >= boardHeight) {
        console.log('bottom wall hit');
        changeDirection();
    }

// // user hits
//     if (ballCurrentPosition[0] > currentPosition[0]
//         && ballCurrentPosition[0] < currentPosition[0] + blockWidth
//         && (ballCurrentPosition[1] > currentPosition[1]
//             && ballCurrentPosition[1] < currentPosition[1] + blockHeight))
//     {
//         console.log('user hit')
//         changeDirection();
//     }
    const userCenterX = currentPosition[0] + blockWidth / 2;
    const userCenterY = currentPosition[1] + blockHeight / 2;

    if (ballCurrentPosition[0] > userCenterX - ballDiameter / 2 &&
        ballCurrentPosition[0] < userCenterX + ballDiameter / 2 &&
        ballCurrentPosition[1] > userCenterY - ballDiameter / 2 &&
        ballCurrentPosition[1] < userCenterY + ballDiameter / 2)
    {
        console.log('user hit');
        changeDirection();
    }

    // Gestion des collisions avec les blocs
    checkCollision();

    // Déplacement de la balle
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
}


timerId = setInterval(moveBall, 30);

// collision
function checkCollision() {
    for (let i = 0; i < blocks.length; i++) {
        if ((ballCurrentPosition[0] > blocks[i].bottomLeft[0]
            && ballCurrentPosition[0] < blocks[i].bottomRight[0]
            && (ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1]
                && ballCurrentPosition[1] < blocks[i].topLeft[1]))
        {
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            allBlocks[i].classList.remove('block');
            blocks.splice(i, 1);
            changeDirection();
            score++;
            scoreDisplay.innerHTML = score;

            if (blocks.length === 0) {
                scoreDisplay.innerHTML = 'You Win!';
                clearInterval(timerId);
                document.removeEventListener('keydown', moveUser);
            }
        }
    }
}

// // wall hits
//     if (ballCurrentPosition[0] >= (boardWidth - ballDiameter)
//         || ballCurrentPosition[0] <= 0
//         || ballCurrentPosition[1] >= (boardHeight - ballDiameter))
//     {
//         console.log('wall hit')
//         changeDirection();
//     }
//
// // user hits
//     if (ballCurrentPosition[0] > currentPosition[0]
//         && ballCurrentPosition[0] < currentPosition[0] + blockWidth
//         && (ballCurrentPosition[1] > currentPosition[1]
//         && ballCurrentPosition[1] < currentPosition[1] + blockHeight))
//     {
//         console.log('user hit')
//         changeDirection();
//     }

// game over
    if (ballCurrentPosition[1] <= 0 || ballCurrentPosition[1] + ballDiameter >= boardHeight)
    {
        clearInterval(timerId);
        scoreDisplay.innerHTML = 'You Lose!';
        document.removeEventListener('keydown', moveUser);
    }

function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2;
        return;
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2;
        return;
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2;
        return;
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2;
        return;
    }
}