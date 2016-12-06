
// TODO: MAKE IT RANDOM AGAIN!!! with cute check mark and every thing.


window.onload= function(){

  document.getElementById("canvas").width = window.innerWidth-100;
  document.getElementById("canvas").height = window.innerHeight-100;


  // moveRange, updateSpd, randomMove;

  let makeWorm = function(t,ln,ll,lt){
    draw((t||200)+1,ln||1,ll||10,lt||10,
    document.getElementById("canvas").width,
    document.getElementById("canvas").height);
  },
  nbInput = document.getElementById("nodeNb"),
  nbWormInput = document.getElementById("wormNb"),
  lenghtInput = document.getElementById("nodeLength"),
  thicknessInput = document.getElementById("nodeThickness"),
  colorInput = document.getElementById("color"),
  reset = function(e){
    if(e.code === "Enter"){

      makeWorm(parseInt(nbInput.value),nbWormInput.value,lenghtInput.value,thicknessInput.value);
    }
  },
  moveRange = 0,
  updateSpd = 0,
  randomMove = 0,
  oldX = 0,
  oldY = 0;

  document.onkeypress = reset;

  draw = function(times,lineNumber,lineLength,lineThickness,w,h){

    function repeat(callback,times,steps,start){

      for(var i = start||0; i<times;i+=steps||1)callback(i);
    }

    function getAngle(x1,y1,x2,y2){

      return Math.atan2(y2 - y1, x2 - x1);
    }

    function rgbColor(a,b,c){

      return "rgb("+a+","+b+","+c+")";
    }

    function background(c) {

       var roundSectionH = Math.ceil(h/40);

        for (var i = 0;i < 40; i++){

          ctx.fillStyle = rgbColor(
              30+Math.floor(70/2*Math.sin(((Math.PI/40)*i)+c/100)+70/2)
              , 2,  80 );

          ctx.fillRect(0,roundSectionH*i,w,roundSectionH);

        }
    }

    function moveLines(array,x1,y1,l){


        var angle,bPoint,cPoint,aPoint,a = array;

        a[a.length-2] = x1;
        a[a.length-1] = y1;
        oldX = x1;
        oldY = y1;

        for(var i = a.length-3; i > 0; i -= 2){

            cPoint = [a[i-1],a[i]]; //current point
            aPoint = [a[i+1],a[i+2]];// point after

            angle = getAngle(aPoint[0],aPoint[1],cPoint[0],cPoint[1]);

            a[i-1] = aPoint[0]+Math.cos(angle)*l;
            a[i] = aPoint[1]+Math.sin(angle)*l;
        }
        return a;
    }

    function drawLines(array){

      for(var i = 0; i < array.length-2; i += 2){

        ctx.lineWidth = lineThickness;
        ctx.strokeStyle = colorInput.value==="#000000"?"rgb(19,209,236)":colorInput.value;
        ctx.beginPath();
        ctx.moveTo( array[i], array[i+1]);
        ctx.lineTo( array[i+2],array[i+3]);
        ctx.stroke();
      }
    }

    var Line = function(){

      this.coords=[];
      for(var i = 0;i < times*2;i += 2){

        let x,y;
        if(i===0){
          x = Math.random()*w;
          y = Math.random()*h;
          oldX = x;
          oldY = y;
        }else{
          x = this.coords[i-2]+lineLength;
          y = this.coords[i-1];
        }

        this.coords.push(x,y);
      }
    };

    var can = document.getElementById("canvas"),
        ctx = can.getContext("2d"),
        count=0,lines=[],start = null,
        canCoords=can.getBoundingClientRect(),
        boringStuff = function(){
          ctx.clearRect(0, 0,can.width, can.height);
          background(count);
          count++;
        };

    repeat( function(){lines.push(new Line())},lineNumber);

    if(!randomMove){
      document.addEventListener("mousemove",function(event){

        boringStuff();
        repeat(function(a){
          drawLines(moveLines(lines[a].coords,
          event.pageX - canCoords.left||0,
          event.pageY - canCoords.top||0,lineLength));
        },lineNumber);

      });
    }else{

      window.setInterval(function(){
        var a = random.r(Math.PI*2);
        var m = (moveRange?random.range(lineLength,moveRange):random.range(lineLength,lineLength*2));
        boringStuff();
        repeat(function(a){
          drawLines(moveLines(lines[a].coords,oldX+Math.cos(a)*m,oldY+Math.sin(a)*m,lineLength));
        },lineNumber);
      },0)
    }

  }
};

    //Ps: no bug plz...
