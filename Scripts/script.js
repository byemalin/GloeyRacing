/*require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js
require https://cdn.jsdelivr.net/npm/p5.party@latest/dist/p5.party.js

sounds: https://www.classicgaming.cc/classics/space-invaders/sounds*/

let shared, me, participants, shoot, explode;
let speedFont;
let scene = 0;
let songs = [];





function preload() {
  speedFont = loadFont('Assets/fonts/GSPEED.otf');
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "spaceInvaders_Localrun8",
    "main1"
  );
  shared = partyLoadShared("globals");
  me = partyLoadMyShared();
  participants = partyLoadParticipantShareds();

  //loading the sounds and images
  // shoot = loadSound("Assets/audio/shoot.wav");
  // explode = loadSound("Assets/audio/explosion.wav");
  car1 = loadImage("Assets/img/car1.png");
  straight1 = loadImage("Assets/img/straight.png");
  left1 = loadImage("Assets/img/left.png");
  right1 = loadImage("Assets/img/right.png");
  straight2 = loadImage("Assets/img/straight2.png");

  introScreen = loadImage("Assets/img/startScreen.jpg");
  endScreen = loadImage("Assets/img/gameoverScreen.jpg");
  endScreen2 = loadImage("Assets/img/gameOver2.jpg");


  songs[0] = loadSound("Assets/audio/lucki.mp3");
  songs[1] = loadSound("Assets/audio/crash2.mp3");
}

function setup() {
  var mainCanvas = createCanvas(900, 900);
  mainCanvas.parent("canvasdiv");
  rectMode(CENTER);
  imageMode(CENTER);
  frameRate(60);
  textFont(speedFont);


  //Toggle Server Info
  partyToggleInfo(false);
  toggle= document.getElementById('toggle');

  // set up game state
  if (partyIsHost()) {
    partySetShared(shared, {
      enemies: [],
      score: 0,
      speed:6,
      hostStart: false,
      hostRestart: false,
    });
  }

  // set up this player's state
  me.bullets = [];
  me.x = 200;
  me.y = height - 250;
  me.colorR = random(255);
  me.colorG = random(255);
  me.colorB = random(255);
}




function draw() {
  background('#292C2A')

  

  switch (scene) {
    case 1:
      waitForHost();
      break;
    case 2:
      game();
      break;
    case 3:
      gameOver();
      break;
    default:
      startScreen();
      break;
  }
}

function startScreen() {
  image(introScreen, width/2, height/2, 900, 900);



  if (mouseX > 500 && mouseX < 800 && mouseY > 120 && mouseY < 200) {
    fill(color("#fff53d"));
    textSize(60);
    text("START", 490, 200);
    if (mouseIsPressed == true) {
      scene = 1;
    }
  } else{
    textSize(60);
    fill(255)
  text("START", 480, 200);
  }

  circle(mouseX,mouseY, 10)
}

function waitForHost() {

  //draw grass borders:
  fill(color("#9f9f9f"))
  rect(0,height/2,300,height)
  rect(width,height/2,300,height)

  push();
  moveLines();
  pop();

  textSize(40);
  
  fill(color("#ed1c24"));
  if (partyIsHost()) {
    textAlign(CENTER);

    //2 layer text
    text("You are the Host!", width/2 +3, 253);
    text("Press ENTER", width/2+3, 453);
    text("to begin", width/2+3, 503);
    text("once everyone", width/2+3, 553);
    text("is ready", width/2+3, 603);



    fill(color("#fff53d"));
    text("You are the Host!", width/2, 250);
    text("Press ENTER", width/2, 450);
    text("to begin", width/2, 500);
    text("once everyone", width/2, 550);
    text("is ready", width/2, 600);
    if (keyCode == 13) {
      shared.hostStart = true;
      //shared.hostRestart = false;
      me.bullets = [];
      shared.score = 0;
      shared.speed = 6;
      shared.enemies = [];

      scene = 2;

      // spawn enemies
      
      for (let i = 0; i < 6; i++) {
        shared.enemies.push({
          x: random(180, width-180),
          y: random(0, -800),
        });
      }

      
    }
  } else if (!partyIsHost()) {
    textAlign(CENTER);
    text("WAIT", width/2, 400);
    text("FOR HOST", width/2, 450);
    if (shared.hostStart == true) {
      songs[0].play();
      scene = 2;

    }
  }

  // draw each participant's ship
  for (const p of participants) {
    if (p.x !== undefined && p.y !== undefined) {
      image(straight2, p.x, p.y, 80, 130);
    }
  }

  // mark this participants ship
  if((keyIsPressed) && (keyCode===39)){
    image(right1, me.x, me.y, 80, 130);
  } else if((keyIsPressed) && (keyCode===37)){
    image(left1, me.x, me.y, 80, 130)
  } else{
    image(straight1, me.x, me.y, 80, 130);
  }




  //move car
  myCar.move();

}

//GAME CASE
function game() {

  //draw grass borders:
  fill(color("#1E3F20"))
  rect(0,height/2,300,height)
  rect(width,height/2,300,height)

  

 

  //move car
  myCar.move();
  push();
  moveLines();
  pop();


  // host moves enemies
  if (partyIsHost()) {
    for (let enemy of shared.enemies) {
        // enemy.y += 4.0;
        enemy.y += shared.speed;


    }
  }


  // COLLISIONS
  
  
  if (partyIsHost()) { //host is handling collisions

    for (let enemy of shared.enemies) {
      if (enemy.x !== null && enemy.y !== null) {
        if (enemy.y < height) {
          for (const p of participants) {
            //if car crash for any participant:
              if (dist(enemy.x, enemy.y, p.x, p.y) < 50) {
                songs[1].play();
                stop();
                 console.log("hit");
                 scene = 3;
              }
          }
        } else {
          //if enemies leave screen, loop them back
          enemy.y = random (0,-800);
          enemy.x = random (180,width-180);
          // increment score & adjust speed
          shared.score++;
          shared.speed+=0.1;
        }
      }
    }
  } else if (!partyIsHost()) {
    for (let enemy of shared.enemies) {
      for (const p of participants) {
        //if car crash for any participant:
          if (dist(enemy.x, enemy.y, p.x, p.y) < 50) {
            songs[1].play();
            stop();
             console.log("hit");
             scene = 3;
          }
      }
    }


  }



  // draw every participant's bullets

  // draw enemies
  for (let enemy of shared.enemies) {

    image(car1, enemy.x, enemy.y, 80, 140);

  }

  // draw each participant's ship
  for (const p of participants) {
    if (p.x !== undefined && p.y !== undefined) {
      image(straight2, p.x, p.y, 70, 120);
    }
  }

  // mark this participants ship
    if((keyIsPressed) && (keyCode===39)){
      image(right1, me.x, me.y, 70, 120);
    } else if((keyIsPressed) && (keyCode===37)){
      image(left1, me.x, me.y, 70, 120)
    } else{
      image(straight1, me.x, me.y, 70, 120);
    }

  // draw score
  fill(255);
  textSize(20);
  text(shared.score, 15, 25);
}

//GAME OVER CASE




  function gameOver() {

    

    songs[0].stop();

  
    
  
    if (partyIsHost()) {
      fill(200, 0, 0);
      text("Press R to restart", width/2, 450);
      image(endScreen, width/2, height/2, 900, 900);
      textSize(20);
      text("Your Score:", 200, 220);
      textSize(40);
      text(shared.score, 200, 270);
    
      shared.hostRestart = false;
    
      if (keyCode == 82) {
        shared.hostRestart = true;
        shared.hostStart = false;
        scene = 1;
      }
    }else if (!partyIsHost()) {
      image(endScreen2, width/2, height/2, 900, 900);
      textSize(20);
      text("Your Score:", 200, 220);
      textSize(40);
      text(shared.score, 200, 270);
      if (shared.hostRestart == true) {
        scene = 1;
      }
    }
  }





//moves the lines
function moveLines() {
  _line.draw();
  _line.move();
  _line1.draw();
  _line1.move();
}

function keyPressed() {
  if (keyCode === ENTER && scene === 1) {
    mode = 1;
    //playing the first song;
    songs[0].play();
  }
}