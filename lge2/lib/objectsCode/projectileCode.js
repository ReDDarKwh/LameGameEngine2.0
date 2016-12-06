

projectileCode = function(inst,dir,origin){


  this.dir = dir;
  this.origin = origin;


  let li = function (pLine1,pLine2){//line intersection

      let  s1_x = pLine1.x2 - pLine1.x1, s1_y = pLine1.y2 - pLine1.y1,
           s2_x = pLine2.x2 - pLine2.x1, s2_y = pLine2.y2 - pLine2.y1,
           s = (-s1_y * (pLine1.x1 - pLine2.x1) + s1_x * (pLine1.y1 - pLine2.y1)) / (-s2_x * s1_y + s1_x * s2_y),
           t = ( s2_x * (pLine1.y1 - pLine2.y1) - s2_y * (pLine1.x1 - pLine2.x1)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {

        return true;
    }

  }


  let lri = function(line,rect){//line in Rectangle intersection

    if(li(line,{x1:rect.left,y1:rect.top,x2:rect.right,y2:rect.top}) || //up
       li(line,{x1:rect.left,y1:rect.bottom,x2:rect.right,y2:rect.bottom})|| //down
       li(line,{x1:rect.left,y1:rect.bottom,x2:rect.left,y2:rect.top})|| //left
       li(line,{x1:rect.right,y1:rect.bottom,x2:rect.right,y2:rect.top})) return true //right

  }


  this.update = function(dt){


    let done = 0;
    objects.typeLoop(function(c,hitbox){


      if(!done){
        if(lri({x1:inst.x, y1:inst.y, x2:inst.x+Math.cos(this.dir)*inst.spd*dt, y2:inst.y+Math.sin(this.dir)*inst.spd*dt},
        {left:c.x+hitbox[0],right:c.x+hitbox[0]+hitbox[2],top:c.y+hitbox[1],bottom:c.y+hitbox[1]+hitbox[3]})){

            if(this.origin==="player"){

              
              switch(c.type){
                case "bunny":
                
                 c.brain.kill();
              
                break;
                
                default:
                 c.brain.hit(inst.brain.dir,2,1);
              }
              
           
           
            }else{

              c.brain.hit(1);
            }

            objects.removeInstance(inst);
            done = 1;
        }
      }

    }.bind(this),this.origin === "player"?objects.enemies:["player"]);


    if(inst.spr.alpha<1){
      inst.spr.alpha+=inst.alphaSpd;
    }

    let col = false;

    world.col.loop(function(c){


      if(lri({x1:inst.rx, y1:inst.ry, x2:inst.rx+Math.cos(this.dir)*inst.spd*dt, y2:inst.ry+ Math.sin(this.dir)*inst.spd*dt},
      {left:c.mX,right:c.mX+world.tileSize,top:c.mY,bottom:c.mY+world.tileSize}))col = true;


    }.bind(this),["trees"],inst.rx,inst.ry,inst.rx+Math.cos(this.dir)*inst.spd*dt,inst.ry+ Math.sin(this.dir)*inst.spd*dt)


    if(!col){
      inst.rx+= Math.cos(this.dir)*inst.spd*dt
      inst.ry+= Math.sin(this.dir)*inst.spd*dt

      if(inst.x<world.x ||
         inst.y<world.y ||
         inst.x>world.x+world.width||
         inst.y>world.y+world.height){

        objects.removeInstance(inst)
      }

    }
    else{

      objects.removeInstance(inst)

    }


  }
}



lazerCode = function(inst,control,dir,help){



var hitbox;

  if(!control){
    this.lazers = [inst];
    this.control = inst;
    this.kill = false;
    this.hitList = {};

  }else{

    this.control = control;

  }

  var madeNext = 0;
  var counter = 0;
  var hitAngle = 0;
  var hitList = {};

  this.update = function(dt){




    if(inst.spr.currentFrame === inst.spr.animList[inst.spr.currentSprite].anim.length-1
    && this.control.brain.lazers.length<15 && !madeNext){

      var lzx = (dir === "left" || dir ==="right")? this.control.brain.lazers[this.control.brain.lazers.length-1]:this.control.brain.lazers[0],
          lzy = (dir === "left" || dir ==="right")? this.control.brain.lazers[0]:this.control.brain.lazers[this.control.brain.lazers.length-1];

      this.control.brain.lazers.push(objects.addInstance({x:lzx.rx+help[dir].x,y:lzy.ry+help[dir].y,
      spr:new Sprite(64,30,0.02,help[dir].angle,this.control.spr.alpha),type:"lazer",defAnim:"lazer",spd:0,control:this.control,dir:dir,dirHelper:help,drawOver:1}));

      madeNext = 1;
    }


    if(!control){

      let hitbox = {up:[-7,0,14,-64*this.lazers.length],
                left:[0,-7,-64*this.lazers.length,14],
                down:[-7,0,14,64*this.lazers.length],
                right:[0,-7,64*this.lazers.length,14]};

      objects.typeLoop(function(c,cHitbox){

        if(rectInRect(inst.x+hitbox[dir][0],
          inst.y+hitbox[dir][1],
          hitbox[dir][2],
          hitbox[dir][3],c.x+cHitbox[0],c.y+cHitbox[1],cHitbox[2],+cHitbox[3])){
          
          switch(c.type){
            case "bunny":
              c.brain.kill();
            break;
            
            default:
              switch(dir){
                case "up":hitAngle = getAngle(inst.x,5,c.x,0);break;
                case "down": hitAngle = getAngle(inst.x,-5,c.x,0);break;
                case "left": hitAngle = getAngle(5,inst.y,0,c.y);break;
                case "right": hitAngle = getAngle(-5,inst.y,0,c.y);break;
              }
              c.brain.hit(hitAngle,2,4*!hitList[c.id],1)
              hitList[c.id] = 1;
            
          }
          

        }else{

          if(hitList[c.id])hitList[c.id] = 0;
        }
      }.bind(this),objects.enemies)


      if(this.kill){

        var deSpd = 0.02;

        inst.spr.alpha-=deSpd;

        if(inst.spr.alpha<=deSpd){

          this.lazers.forEach(function(c){
            objects.removeInstance(c);
          });
        }

      }else{

        inst.spr.alpha = 1/10*Math.sin(counter/10)+9/10;
        counter++;
      }

    }else{

      inst.spr.alpha = this.control.spr.alpha;
    }
  }


}
