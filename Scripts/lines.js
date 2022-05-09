//broken yellow lines

let _line = {
    x: 450,
    y:0,
    x2: 450,
    y2: 50,
    
    col: "#FFFFFF",
    draw: function(){
        strokeWeight(5);
        stroke("#FFFFFF");
        line(this.x, this.y, this.x2, this.y2);
    },
    //moving function
    move: function(){
      this.y+=shared.speed-4;
      this.y2+=shared.speed-4;
      if(this.y>height){
        this.y=-50;
        this.y2=100;
      }
    }

  }
  //second broken lines
  let _line1 = {
    x: 450,
    y: 300,
    x2: 450,
    y2: 350,
    sp: 5,
    col: "#FFFFFF",
    draw: function(){
        strokeWeight(5);
        stroke("#FFFFFF");
        line(this.x, this.y, this.x2, this.y2);
    },
    //moving the second line
    move: function(){
      this.y+=shared.speed-4;
      this.y2+=shared.speed-4;
      if(this.y>height){
        this.y=-50;
        this.y2=100;
      }
    }
  }