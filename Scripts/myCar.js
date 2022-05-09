let myCar = {
    //movement
    move: function(){
        //while right arrow keyispreesed move the car right with limits of street
        if((keyIsPressed) && (keyCode===39) && (me.x<720)){
            // me.x+=8;
            me.x+=shared.speed;
          }
          //left
          if((keyIsPressed) && (keyCode===37) && (me.x>180)){
            // me.x-=8;
            me.x-=shared.speed;
          }
    },
    draw: function(){

    }
  }