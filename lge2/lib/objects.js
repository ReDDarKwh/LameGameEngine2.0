

function Obj(o,id){

  if(o.type!="player"){

    this.rx = o.x;
    this.ry = o.y;
    this.x = world.x+this.rx;
    this.y = world.y+this.ry;
  }else{

    this.x = 0;
    this.y = 0;

    world.x = -o.x;
    world.y = -o.y;

    this.rx = this.x-world.x;
    this.ry = this.y-world.y;
  }

  this.drawOver = o.drawOver || 0 ;
  this.spr = o.spr;
  this.spd = o.spd?o.spd:objects.list[o.type].info.spd;
  this.id = id;
  this.type = o.type;
  this.brain = {};
  this.hitbox = objects.list[this.type].info.hitbox;
  this.wHitbox = objects.list[this.type].info.wHitbox;

  let inst = this;

  switch(this.type){

    case "player":

      objects.player = this;

      this.brain = new playerCode(this);

      this.customUpdates = ["player"];

      this.changeType = function(type,w,h,defAnim){

        if(this.brain.transformType!= type){


          this.customUpdates = objects.list[type].info.updates;
          this.spd = objects.list[type].info.spd;
          this.hitbox = objects.list[type].info.hitbox;

          if(this.brain[this.brain.transformType]){
            if(this.brain[this.brain.transformType].endCode)this.brain[this.brain.transformType].endCode();
          }

          this.spr.animList = objects.list[type].anims;
          this.spr.ow = w;
          this.spr.oh = h;
          this.spr.setSprite(defAnim,true);
          this.brain.transformType = type;
          this.brain.state = "moving";


          this.y += this.wHitbox[1]-objects.list[type].info.wHitbox[1];
          this.x += this.wHitbox[0]-objects.list[type].info.wHitbox[0];

          this.wHitbox = objects.list[type].info.wHitbox;

        }

      }

    break;
    case "slime":

      this.brain = new slimeCode(this);
    break;


    case "projectile":

      this.brain = new projectileCode(this,o.dir,o.origin||"player");
      this.alphaSpd = o.alphaSpd|| 0.05;

    break;

    case "lazer":


      this.brain = new lazerCode(this,o.control,o.dir,o.dirHelper);
      this.kill = function(){this.brain.kill = true; this.spr.alpha = 1};
    break;

    case "effect":
      switch(o.name){

        case "lazer":

        this.brain.update = function(){
          if(this.spr.done){
            objects.removeInstance(this)
            objects.shoot(this.rx,this.ry-1,getMouseAngle(this.rx,this.ry),900,"lazer",0,0.5)

          };
          this.rx = this.follow.rx+o.headPos[0];
          this.ry = this.follow.ry+o.headPos[1];
        }.bind(this)
        this.follow = o.follow;

        break;
        case "bunnyDeath":

        this.brain = {

          forceX : random.range(-1,1),
          forceY : -random.range(0.5,1),
          grav : 0.05,
          initalY:inst.ry+random.r(5),
          rotation:random.range(-Math.PI/12,Math.PI/12),
          counter:0,

          update:function(dt){

            if(inst.ry<=this.initalY){
              inst.ry+=this.forceY;
              inst.rx+=this.forceX;
              inst.spr.angle+=this.rotation;
              this.forceY+=this.grav;
            }else{
              this.counter+=dt;

              if(this.counter>=2){
                inst.spr.alpha -= 0.01;
                if(inst.spr.alpha<=0){

                  objects.removeInstance(inst);
                }
              }
            }
          }
        }

        break;
      }

    break;
    case "bunny":
      this.spd = 30;
      this.brain = {

        moveCounter : 0,
        distance:0,
        cDistance:0,
        dir:["up","left","down","right"],
        currentDir:"",
        moving:0,
        lastRl:"right",
        kill: function(){
          if(!inst.remove){

            for(let i=0;i<4;i++){
              objects.addInstance({x:inst.rx,y:inst.ry,spr:new Sprite(16,16),type:"effect",name:"bunnyDeath",defAnim:"bunnyBit"+i});
            }

            for(let i=0;i<10;i++){
              objects.addInstance({x:inst.rx,y:inst.ry,spr:new Sprite(16,16),type:"effect",name:"bunnyDeath",defAnim:"bunnyBit4"});
            }

            objects.removeInstance(inst);
          }
        },

        update : function(dt){

          if(this.moveCounter<=0){
            this.moving = 1;
            this.currentDir = this.dir[random.roundRange(0,3)];
            if(this.currentDir === "right" || this.currentDir === "left"){
              this.lastRl = this.currentDir;
            }
            inst.spr.setSprite(this.currentDir);
            this.distance = random.range(0,70);
            this.moveCounter = random.range(1,10);
          }

          if(this.moving){
            let vx = inst.spd*dt*key.fourDir[this.currentDir][0],
                vy = inst.spd*dt*key.fourDir[this.currentDir][1];

            this.cDistance+= Math.abs(vx+vy);

            if(this.cDistance>=this.distance  ||
               world.col.checkCollisions(inst.rx+inst.wHitbox[0]+vx,
                                         inst.ry+inst.wHitbox[1]+vy,
                                         inst.wHitbox[2],inst.wHitbox[3])){

              inst.spr.setSprite("idle"+ this.currentDir.replace(/\w/,match=>match.toUpperCase()));
              this.moving = 0;
              this.cDistance = 0;
            }else{
              inst.rx+=vx;
              inst.ry+=vy;
            }

          }else{

            this.moveCounter-=dt;
          }
        }
      }

    break;
    case "archer":

      let Archer = function(inst){
        this.mode = "idle";
        this.canShoot = true;
        this.life = this. initialLife = 10;
        this.inst = inst;
        this.path = new Path(inst,9);
        this.counter = 0;
        this.lastRl = "Right";

        inst.spd /= 2;

        this.findEndPoint = function(dis){

          let angle = getAngle(objects.player.x,objects.player.y,inst.x,inst.y);
          let mdis = dis;

          return [objects.player.rx+Math.cos(angle)*mdis,objects.player.ry+Math.sin(angle)*mdis];
        }

        this.archerNewPath = function(dis){
          let point = this.findEndPoint(dis);
          this.newPath("getAway",point[0],point[1]);
        }


        let viewDis = 350, attackDis = 250, attackStopDis = 150;

        this.update = function(dt){

          this.badGuyUpdate();

          let pDis = getDistance(objects.player.x,objects.player.y,inst.x,inst.y);
          let shootAngle = getAngle(inst.rx,inst.ry,objects.player.rx,objects.player.ry);
          let side = answerByAngle(shootAngle,["Up","Left","Down","Right"]);

          if(side === "Right" || side === "Left"){

            this.lastRl = side;
          }


          this.counter+=dt;

          switch(this.mode){

            case "chasing":

              if(pDis>viewDis){

                this.mode = "idle";
                this.path.done = 1;

              }else{

                if(this.path.done || this.counter>=2){

                  this.newPath("chasing",objects.player.rx,objects.player.ry);
                  this.counter = 0;
                }

                if(pDis<=attackDis){

                  this.mode = "attacking";
                  this.path.done = 1;
                }

                this.path.update(dt);
              }


            break;
            case "attacking":

              if(inst.spr.currentFrame === 7){
                if(this.canShoot){
                  objects.shoot(inst.rx,inst.ry,shootAngle,150,"arrow",1,0,"enemy");
                  this.canShoot= false;
                }
              }else{
                this.canShoot= true;
              }


              if(pDis>attackDis){

                this.mode = "chasing";
                this.path.done = 1;
              }else{


                if(pDis>attackStopDis){

                  if(this.path.name === "getAway"){

                    this.path.done = 1;
                  }

                  if(this.path.done || this.counter>=1){
                    this.newPath("attackChasing",objects.player.rx,objects.player.ry);
                    this.counter = 0;
                  }

                  console.log("bigger")

                }else{

                  if(this.path.name === "attackChasing"){

                    this.path.done = 1;
                  }

                  if(pDis<attackStopDis){
                    if(this.path.done || this.counter>=1){

                      this.archerNewPath(attackStopDis);


                      counter = 0;

                    }


                  }
                }

                this.path.update(dt);
                inst.spr.setSprite((this.path.done?"attack":"attackMove")+side,0,1);
              }


            break;
            case "idle":

              if(pDis<viewDis){

                this.mode = "chasing";
              }else{

                inst.spr.setSprite("idle"+this.lastRl);

              }

            break;
            case "pushed":

              let moveX = Math.cos(this.pushAngle)*this.forceX,
                  moveY = Math.sin(this.pushAngle)*this.forceY;

              this.inst.spr.setSprite("idleRight");
              this.move(moveX,moveY);

              if(this.life<=0 ){

                objects.removeInstance(inst);
              }

              if(this.forceX<=0 && this.forceY<=0){
                this.mode = "attacking"
                this.path.done = 1;
              }

            break;
          }

           objects.typeLoop(function(c){

            if(inst.id!==c.id){

              let dis = getDistance(inst.rx,inst.ry,c.rx,c.ry);
              let angle = getAngle(inst.rx,inst.ry,c.rx,c.ry);
              let radius = 10;
              if(dis<radius){
                inst.rx+= Math.cos(angle)*((Math.max(dis-radius,-1)));
                inst.ry+= Math.sin(angle)*((Math.max(dis-radius,-1)));
              }
            }

          },[inst.type])
        }
      }

      Archer.prototype = objects.badGuys;

      this.brain = new Archer(this)

    break;
    case "tree":

      this.brain = {

        update : function(){

          if(objects.player.rx>inst.rx-40 && objects.player.rx<inst.rx+40 &&
             objects.player.ry < inst.ry-20 && objects.player.ry > inst.ry-80){

            if(inst.spr.alpha > 0.5){
               inst.spr.alpha -= 0.04;
            }else{
              inst.spr.alpha = 0.5;
            }

          }else{

            if(inst.spr.alpha<1){
              inst.spr.alpha += 0.04;
            }else{
              inst.spr.alpha = 1;
            }
          }
        }
      }
    break;
  }


}


var objects = {

  list : {},

  enemies:["slime","bunny","archer"],

  objectsYorder:[],
  objectsOver:[],

  objectNum : 0,
  gotToClean: new Set(),

  ySort: function(){
    this.objectsYorder.sort(function(a,b){

      let ay,by;

      ay = a.y;
      if(a.wHitbox)ay = a.y+a.wHitbox[1]+a.wHitbox[3];
      by = b.y;
      if(b.wHitbox)by = b.y+b.wHitbox[1]+b.wHitbox[3];

      return ay-by;
    });
  },


  addInstance : function(o){


    o.spr.animList = this.list[o.type].anims;
    if(o.defAnim)o.spr.setSprite(o.defAnim);

    let instance = new Obj(o,this.objectNum);

    if(instance.drawOver){
      this.objectsOver.push(instance);
    }else{
      this.objectsYorder.push(instance);
    }

    this.list[o.type].insts.push(instance);
    this.objectNum++;

    return instance;

  },


  cleanUp: function(){

    this.gotToClean.forEach(function(type){

      this.list[type].insts =  this.list[type].insts.filter(c=> !c.remove);

    }.bind(this))

    this.gotToClean.clear();

  },

  removeInstance : function(inst){


    if(!inst.remove){
      let index;
      inst.remove = true;

      if(inst.drawOver){

        index = this.objectsOver.map(c=>c.id).indexOf(inst.id);
        this.objectsOver.splice(index,1);
      }else{

        index = this.objectsYorder.map(c=>c.id).indexOf(inst.id);
        this.objectsYorder.splice(index,1);
      }

      this.gotToClean.add(inst.type);
    }

  },


  addType : function(type,sprs,info){

    this.list[type]= {insts:[],anims:{}} ;

    switch(type){

      case"tree":
        this.list[type].info = {hitbox:[-3,-9,7,17],wHitbox:[-5,-4],spd:0,updates:[]};
      break;

      default:this.list[type].info = info||{};

    }


    if(this.list[type].info.wHitbox)this.list[type].info.wHitbox =
     this.list[type].info.wHitbox.concat([11,6]);

    sprs.forEach(function(c){

     if(typeof c.anim === "string")c.anim = toArray(c.anim);
     c.image = new Image();
     c.image.src = "./assets/sprites/"+ c.path;
     this.list[type].anims[c.name] = c;

   }.bind(this))

    function toArray(str){

      if(str.includes("-")){

        let temp = str.split("-").map(c=>parseInt(c,10)),
            dif = temp[1]-temp[0];

        for(let i = 1; i<=Math.abs(dif)-1; i++){

          temp.splice(i,0,temp[0]+Math.sign(dif)*i)
        }

        return temp;

      }else{

        return str.split(",").map(c=>parseInt(c,10));
      }
    }

    return type;
  },

  badGuys : {

    forceX:0,
    forceY:0,
    pushAngle:0,

    badGuyUpdate: function(){

      if(this.inst.brain.mode === "chasing"){

        this.inst.spr.setSprite(answerByAngle(this.inst.brain.path.angle,
          ["up","left","down","right"]))

      }

      if(this.inst.spr.alpha<1){
        this.inst.spr.alpha+=0.05;
      }

      this.forceX -= 0.1;
      this.forceX = Math.max(0,this.forceX);
      this.forceX = Math.min(4,this.forceX);

      this.forceY -= 0.1;
      this.forceY = Math.max(0,this.forceY);
      this.forceY = Math.min(4,this.forceY);

      this.inst.rx = Math.max(5,this.inst.rx);
      this.inst.rx = Math.min(world.width-5,this.inst.rx);

      this.inst.ry = Math.max(5,this.inst.ry);
      this.inst.ry = Math.min(world.height-5,this.inst.ry);

    },

    newPath : function(name,x,y){

      x = Math.max(0,x);
      x = Math.min(world.width-world.tileSize,x);
      y = Math.max(0,y);
      y = Math.min(world.height-world.tileSize,y);

      this.path.setPath(name,astar.run(world.colMap,
      {x:Math.floor(this.inst.rx/world.tileSize),y:Math.floor(this.inst.ry/world.tileSize)},
      {x:Math.floor((x)/world.tileSize),y:Math.floor((y)/world.tileSize)}));
    },

    hit: function(angle,force,dmg,set){
      this.pushAngle = angle;

      if(set){
        this.forceX=force;
        this.forceY=force;
      }else{
        this.forceX+=force;
        this.forceY+=force;
      }
      this.mode = "pushed";
      this.life-=dmg;
    },

    move:function(moveX,moveY){

      var hitbox = objects.list.slime.info.wHitbox;
      var col = world.col.playerCheckCollisions(this.inst.rx+objects.list.slime.info.wHitbox[0],
        this.inst.ry+objects.list.slime.info.wHitbox[1],moveX,moveY,objects.list.slime.info.wHitbox[2],objects.list.slime.info.wHitbox[3]),
         colX = col[0] , colY = col[1],collided=false;

      if(!colX && !colY){
        cantCollide=false;
      }


      if(colX){moveX=0;this.forceX=0;}
      if(colY){moveY=0;this.forceY=0;}

      if(colX || colY){
        collided = true;
      }
      this.inst.rx += moveX;
      this.inst.ry += moveY;

      return collided;

    },

    drawLife:function(){
      if(this.life<=0)return;
      ctx.save();
        ctx.fillStyle = "rgb(204, 68, 63)";
        ctx.fillRect(this.inst.x-6,this.inst.y-12,12,2);
        ctx.fillStyle = "rgb(0, 209, 230)"
        ctx.fillRect(this.inst.x-6,this.inst.y-12,(12/this.initialLife)*this.life,2);
      ctx.restore();
    }

  },

  shoot : function(x,y,dir,spd,style,alpha,alphaSpd,origin){
    objects.addInstance({x:x,y:y,
                        spr:new Sprite(16,16,0.12,dir,alpha===undefined?1:alpha),
                        type:"projectile",defAnim:style,spd:spd,dir:dir,alphaSpd:alphaSpd,origin:origin});

  },

  lazer: function(x,y,dir){

    var d = {up:{x:-1,y:-64,angle:-Math.PI/2},down:{x:1,y:64,angle:Math.PI/2},
    right:{x:64,y:-1,angle:0},left:{x:-64,y:1,angle:Math.PI}}


    return objects.addInstance({x:x,y:y,
                               spr:new Sprite(96,64,0.02,d[dir].angle),
                               type:"lazer",defAnim:"lazerStart",spd:0,
                               control:0,dir:dir,dirHelper:d,drawOver:1})


  },

  typeLoop:function(callback,types){

    types.forEach(function(c){

      this.list[c].insts.forEach(function(cc){

        callback(cc,cc.hitbox);
      })
    }.bind(this))
  }



};
