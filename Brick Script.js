//DOM ELEMENTS GRABBED
var canvas = document.getElementById('myCanvas');
//USEFUL LINE OF CODE THAT WILL REPEAT IN MANY PROJECTS
//it allows us to draw on the canvas
var ctx = canvas.getContext('2d');
//ctx can be renamed to anything



//EVENT LISTENERS, (some are) ON THE DOM ELEMENTS or user controls
document.addEventListener('keydown', keyDownhandler);
document.addEventListener('keyup', keyUphandler);

document.addEventListener("mousemove", mouseMoveHandler);


//GLOBAL VARIABLES

//paddle
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;  //here is paddle Starting X-coord
var paddleHeight = 10;
var paddleY = canvas.height - paddleHeight;  //paddle top y-coord

//ball
var ballRadius = 10;
var x = canvas.width/2;             //ball starting X-coord
var y = paddleY - ballRadius - 5;   //ball starting Y-coord
var dx = 2;
var dy = -2;

var lives = 3;
var score = 0;

//user controls
var rightPressed = false;
var leftPressed = false;

//Bricks
var brickRowCount = 3;
var brickColumnCount = 5;

var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;

var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for ( c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for ( r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {x: 0, y:0, status: 1}
    //status is if brick has been hit or not
  }
}

/*this gives:
bricks[0][0] = {x: 0, y:0, status: 1}
bricks[0][1] = {x: 0, y:0, status: 1}
bricks[0][2] = {x: 0, y:0, status: 1}

bricks[1][0] = {x: 0, y:0, status: 1}
bricks[1][1] = {x: 0, y:0, status: 1}
bricks[1][2] = {x: 0, y:0, status: 1}
.
.
*/


//FUNCTIONS
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for ( c = 0; c < brickColumnCount; c++) {
    for ( r = 0; r < brickRowCount; r++) {

      //draw a brick only is it has not been hit, status = 1
      if (bricks[c][r].status == 1) {

        var brickX = ((brickWidth+brickPadding) * c) + brickOffsetLeft;
        var brickY = ((brickHeight+brickPadding) * r) + brickOffsetTop;

        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//collision of ball with bricks
function collisionDetect() {
  for ( c = 0; c < brickColumnCount; c++) {
    for ( r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      //if brick has not yet been hit (status == 1)
      if(b.status == 1) {
        //if center of ball is between X-sides of brick && between top and bottom of brick
        if ( x > b.x && x < (b.x + brickWidth) && y > b.y && y < (b.y+brickHeight) ) {
          //change direction
          dy = -dy;
          //change brick status
          b.status = 0;
          score += 100;

          //win condition
          if ((score / 100) == brickRowCount*brickColumnCount ){
            alert("You Win! Earth did not explode. Good Job!");
            //restart game
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore () {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  //fillText (text, X-coord, Y-coord)
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives () {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  //fillText (text, X-coord, Y-coord)
  ctx.fillText("Lives: " + lives, (canvas.width-100), 20);
}

function draw(){
  //this whole function (with setInterval(draw, 10) does:
  // 1: clear the canvas with clearRect(). 2. draw the object.
  // 3. clear the cavnas. 4. draw object in new positon. 5. Repeat.

  //clearing code: (this prevents a moving object from leaving a trail)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBricks();
  drawBall();
  collisionDetect();
  drawScore();
  drawLives();

  //collision detection, if ball is at wall coord, change direction
  //accounting for ballRadius gives a more accurate detection

  if (x <= ( 0 + (ballRadius) ))           {   dx = -dx;  }
  if (x >= (canvas.width - (ballRadius) )) {   dx = -dx;  }

  if (y <= ( 0 + (ballRadius) ) )          {   dy = -dy;  }
  //if (y >= (canvas.height - (ballRadius) )){   dy = -dy;  }
  //ball can fall through bottom of canvas
  //else if ( y >= (canvas.height - paddleY)) {
  //else if ( y >= 285) {
  else if ( y > paddleY ) {

    //for collision with paddle:
    //between X values of paddle:
    //tried adding || dy > 0 (ball is moving down) to try and correct glitch
    //glitch could only be solved by making the paddle be at the bottom of the canvas
    if ( x >= paddleX && x <= (paddleX + paddleWidth) ) {
         dy = -dy;
    } else if ( y > canvas.height ) {
      lives--;
      //player lost all their lives:
      if (lives === 0){
        //could also do if ( !lives )  because 0 is cconsidered "false"
        alert("  You lost all your lives!  The Earth explodes.  Good job.");
        //reload the page:
        document.location.reload();
        //document.location is the url of the page.
        //so .reload(),  relaods that url.
      } else {
        //reset the ball and paddle
        //set delay here?
        x = canvas.width/2;             //ball starting X-coord
        y = paddleY - ballRadius - 5;   //ball starting Y-coord
        dx = 2;
        dy = -2;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }

  //another way:
  //if (y + dy <= 0) { dy = -dy; }
  //if (y + dy >= canvas.height) { dy = -dy; }

  //OR, smaller version:
  //if (y + dy <= 0 || y + dy >= canvas.height) { dy = -dy; }

  //WITH ballRadius accounted for:
  //if (y + dy <= ballRadius || y + dy >= canvas.height-ballRadius) { dy = -dy; }


/*MOVED to incorporate elsewhere to be more concise/sofisticated
  //for collision with paddle:
  //top Y of paddle AND!!! between X values of paddle:
  if ( (x + dx) >= paddleX
     && (x + dx) <= (paddleX+paddleWidth)
     && (y + dy + ballRadius) >= paddleY )  {
       dy = -dy;
  }
  */

  //move paddle
  //if key is pressed and paddle is not touching side walls, move paddle
  if ( rightPressed == true && (paddleX + paddleWidth) <= canvas.width ) {
    //NOTE do not need to include " == true "
    paddleX += 7;
  } else if ( leftPressed == true && paddleX >= 0 ) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;

  //this replaced the setInterval(draw, 10); to be smoother
  //BUT!!!! it seems to be way too slow, so undid this change
  //requestAnimationFrame(draw);
}


//user keyboard controls for the paddle
function keyDownhandler(event) {
  if ( event.keyCode == 39 ) {
    //NOTE keyCode MUST!!! have Capitcal C in key C ode
    //keycode 39 = right arrow button
    rightPressed = true;
  } else if ( event.keyCode == 37 ){
    //keycode 37 = left arrow button
    leftPressed = true;
  }
}
//when keybaord key is released:
function keyUphandler(event) {
  if ( event.keyCode == 39 ) {
    rightPressed = false;
  } else if ( event.keyCode == 37 ){
    leftPressed = false;
  }
}

//when player moves the mouse left or right:
function mouseMoveHandler(event) {
  var relativeX = event.clientX - canvas.offsetLeft;
  //clientX is the X-coord of the mouse.
  //this also effectively ignores the mouse if it is off the canvas
  if (relativeX > 0 && relativeX < canvas.width) {
    //if mouse X-coord is > right side of canvas, it stops move the paddle right
    //offsetLeft is how far X pixels is the canvas from the left edge of the screen
    paddleX = relativeX - paddleWidth/2;
    //we are acting on the middle of the paddle
  }
}


//setInterval ( function, milliseconds );
setInterval(draw, 10);
//NOTE this is a fixed frame rate, which is not as smooth as the method below
//BUT!!! the below method seems to be way too slow

//draw();
//then add at the end of the draw() function:
//requestAnimationFrame(draw);
//this method gives control of the framerate to the browser instead of giving it a fixed number
//it will render the shapes only when needed
//this is smoother and more efficient animations
