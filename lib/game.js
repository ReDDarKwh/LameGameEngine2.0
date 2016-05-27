




const can = document.getElementById("canvas"), ctx = can.getContext("2d"),
run = window.requestAnimationFrame;


can.width = 1300; //window.innerWidth-100;
can.height =  can.width/2;//window.innerHeight-100;
ctx.imageSmoothingEnabled = false;

var gameScaleX=4,gameScaleY=4;

ctx.translate(can.width/2,can.height/2);
ctx.scale(gameScaleX,gameScaleY);


function getMouseAngle(x,y){

   return getAngle(x,y,key.mouseX,key.mouseY);

}


function getAngle(x1,y1,x2,y2){

  return Math.atan2(y2 - y1, x2 - x1);
}

function getDistance(x1,y1,x2,y2){

    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}


var debug = {

  bullets:document.getElementById("bullets"),

  enemies:document.getElementById("enemies")

};




var random = {

  r: function (n){

    return Math.random()*n;
  },


  round: function (n){

    return Math.round(this.r(n));
  },

  range: function (min,max){

   return Math.random()*(max-min)+min;
  },

  roundRange: function(min, max){

    return Math.round(this.range(min,max))
  }


}



function checkCol(x1,y1,v1,h1,x2,y2,v2,h2){

  var left1 = x1-v1,right1 = x1+v1, bottom1 = y1+h1,top1 = y1-h1,
      left2 = x2-v2,right2 = x2+v2, bottom2 = y2+h2,top2 = y2-h2;

  if(right1 > left2 && left1 < right2){
    if(bottom1> top2 && top1< bottom2){

     return true;

    }
  }


  return false;

}



function isInRect(x,y,rx,ry,rw,rh){

  return x>=rx && y>=ry && x <=rx+rw && y<=ry+rh;


}


function changeScale(n){

  if(gameScaleX+n>0 && gameScaleY+n>0 && gameScaleX+n <= 10 && gameScaleY+n <= 10){ //&& gameScaleX+n<10 && gameScaleY+n<10){

    gameScaleX+=n;

    gameScaleY+=n;
   //can.width* scaleX

    ctx.resetTransform()
    ctx.translate(can.width/2,can.height/2);
    ctx.scale(gameScaleX,gameScaleY)
    console.log(gameScaleX,gameScaleY);
  }
   // console.log(gameScaleX);
}



function Path(obj){

  this.done =1;
  this.angle = 0;

  this.update = function(dt){

    if(this.done)return;

    //current path Section
    var distanceOnSection = getDistance(pathSections[index].x, pathSections[index].y,
    obj.rx+Math.cos(pathSections[index].angle)*obj.spd*dt, obj.ry+Math.sin(pathSections[index].angle)*obj.spd*dt);

    this.angle = pathSections[index].angle;

    var overShotLength = distanceOnSection - pathSections[index].distance;


    if(overShotLength>0){

      let first = 1;
      do {

        index++;

        if(!pathSections[index]){
          obj.rx = pathEndX;
          obj.ry = pathEndY;
          this.done = 1;
          return;
        }

        if(!first){

          overShotLength-=pathSections[index].distance;
        }else{first=0}

      } while (overShotLength >  pathSections[index].distance);


      obj.rx = pathSections[index].x + Math.cos(pathSections[index].angle)*overShotLength;
      obj.ry = pathSections[index].y + Math.sin(pathSections[index].angle)*overShotLength;



    }else{
      obj.rx+= Math.cos(pathSections[index].angle)*obj.spd*dt;
      obj.ry+= Math.sin(pathSections[index].angle)*obj.spd*dt;
    }
  };




  var index = 0, pathSections = [], pathEndX = 0, pathEndY = 0;

  this.setPath = function(path){

    if(path.length<1){this.done =1; return}

    pathEndX = path[path.length-1][0]+8;
    pathEndY = path[path.length-1][1]+8;
    index = 0;
    pathSections = [];

    this.done = 0;
    this.path = [[obj.rx,obj.ry]].concat(path.map(function(c){return c.map(cc=>cc+8)}));


    for(let i = 0; i< this.path.length-1; i++){

      var p = [this.path[i][0],this.path[i][1],this.path[i+1][0],this.path[i+1][1]];



      pathSections.push({
        x:p[0],
        y:p[1],
        distance:getDistance(p[0],p[1],p[2],p[3]),
        angle:getAngle(p[0],p[1],p[2],p[3])
      });
    }


  }



}
