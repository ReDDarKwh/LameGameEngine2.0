




const can = document.getElementById("mainCanvas"),uican = document.getElementById("uiCanvas"),
            ctx = can.getContext("2d"),uictx = uican.getContext("2d"),cursor = document.getElementById("cursor") ;

can.width= uican.width = 1300;
can.height = uican.height = can.width/2;

function initUican(){


  uican.style.position = "absolute";
  uican.style.top = can.offsetTop+can.clientTop + "px";
  uican.style.left = can.offsetLeft+can.clientLeft + "px";


}


ctx.imageSmoothingEnabled = false;
uictx.imageSmoothingEnabled = false;

uictx.textAlign = "right";
uictx.textBaseline = "top";
uictx.font = "25px myFirstFont";
uictx.strokeStyle = "white";
uictx.lineWidth=0.5;

var gameScaleX=4,gameScaleY=4;

ctx.translate(can.width/2,can.height/2);
ctx.scale(gameScaleX,gameScaleY);




function gameOver(){




}


function getMouseAngle(x,y){

   return getAngle(x,y,key.mouseX,key.mouseY);

}


function getAngle(x1,y1,x2,y2){

  return Math.atan2(y2 - y1, x2 - x1);
}

function getDistance(x1,y1,x2,y2){

    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}




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



function rectInRect(x1,y1,w1,h1,x2,y2,w2,h2){

  var left1 = w1>=0? x1: x1+w1,
      right1 = w1>=0? x1+ w1: x1,
      top1 = h1>=0? y1: y1+h1,
      bottom1 = h1>=0? y1+h1: y1;

  var left2 = w2>=0? x2: x2+w2,
      right2 = w2>=0? x2+ w2: x2,
      top2 = h2>=0? y2: y2+h2,
      bottom2 = h2>=0? y2+h2: y2;

  if(right1 > left2 && left1 < right2){
    if(bottom1> top2 && top1< bottom2){

     return true;

    }
  }


}

function typeCollide(type,obj,radius,spd){

  let moveX=0,moveY=0;

  objects.list[type].insts.forEach(function(current){

    if(obj.id!==current.id){

      let dis = getDistance(obj.rx,obj.ry,current.rx,current.ry);

      if(dis < radius*2){

        let angle = getAngle(current.rx,current.ry,obj.rx,obj.ry),move = 2*radius-dis;

        moveX+= Math.cos(angle)*spd*(move/10);
        moveY+= Math.sin(angle)*spd*(move/10);



      }
    }
  })

  return[moveX,moveY];
}



function isInRect(x,y,rx,ry,rw,rh){

  var left = rw>=0? rx: rx+rw;
      right = rw>=0? rx+rw: rx;
      topp = rh>=0? ry: ry+rh;
      bottom = rh>=0? ry+rh: ry;


      return x>=left && x<=right && y>=topp && y<=bottom;


}



var paths = {};

function Path(obj,offsetX,offsetY){

  this.done = 1;
  this.angle = 0;
  this.name = "";

  this.update = function(dt){

    if(this.done)return;

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

      obj.rx += Math.cos(pathSections[index].angle)*obj.spd*dt;
      obj.ry += Math.sin(pathSections[index].angle)*obj.spd*dt;
    }
  };

  var index = 0, pathSections = [], pathEndX = 0, pathEndY = 0;

  this.setPath = function(name,path){
    if(path.length<1){this.done =1; return}

    let oy = offsetY||0;
    let ox = offsetX||0;

    pathEndX = path[path.length-1][0]+ox;
    pathEndY = path[path.length-1][1]+oy;
    index = 0;
    pathSections = [];
    this.name = name;
    this.done = 0;
    this.path = [[obj.rx,obj.ry]].concat(path.map(function(c){return [c[0]+=ox,c[1]+=oy]}));

    for(let i = 0; i< this.path.length-1; i++){

      var p = [this.path[i][0],this.path[i][1],this.path[i+1][0],this.path[i+1][1]];

      pathSections.push({
        x:p[0],
        y:p[1],
        distance:getDistance(p[0],p[1],p[2],p[3]),
        angle:getAngle(p[0],p[1],p[2],p[3])
      });
    }
  };
}


function answerByAngle (angle,answer){
  let result;
  angle *=(180/Math.PI);
  switch(true){
    case (angle >= -135 && angle <= -45): result = answer[0];//up
    break;
    case (angle < -135 && angle >= -180 || angle> 135 && angle<=180): result = answer[1];//left
    break;
    case (angle <= 135 && angle >= 45): result = answer[2];//down
    break;
    case (angle > -45 && angle < 0 || angle< 45 && angle>=0): result = answer[3];//right
    break;
  }

  return result;
}
