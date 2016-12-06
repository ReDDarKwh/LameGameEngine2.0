






playerCode = function(inst){


  this.transformType = inst.type;

  this.life = this.initialLife = 100;

  this.movingX = "world",
  this.movingY = "world",
  this.state = "moving";
  this.lastRl = "right";
  this.force = 0;
  this.pushAngle = 0;
  this.lastMove = "right";
  this.inst = inst;

  this.drawLife =function(){
      if(this.life<=0)return;
      uictx.save();
        uictx.fillStyle = "rgb(204, 68, 63)";
        uictx.fillRect(10,uican.height-10,uican.width-20,-6);
        uictx.fillStyle = "rgb(0, 209, 230)"
        uictx.fillRect(10,uican.height-10,((uican.width-20)/this.initialLife)*this.life,-6);
        uictx.strokeStyle = "black"
        uictx.strokeRect(10,uican.height-10,uican.width-20,-6);
      uictx.restore();
    }

  this.hit = function(dmg){

    this.life-=dmg;
    if(this.life<=0){

      gameOver();
    }
  }

  var pSprite =  inst.spr,
  playerMove = function(moveX,moveY){
    var col =
    world.col.playerCheckCollisions(inst.rx+inst.wHitbox[0],
      inst.ry+inst.wHitbox[1],
      moveX,moveY,inst.wHitbox[2],
      inst.wHitbox[3]), colX = col[0] , colY = col[1];

    if(colX)moveX=0;
    if(colY)moveY=0;

    if(this.movingX === "world" ){

     world.x-=moveX;


    }else{

     inst.x+=moveX;
     inst.x = Math.min(inst.x,world.x+world.width);
     inst.x = Math.max(inst.x,world.x);
    }

    if(this.movingY === "world"){

      world.y-=moveY;

    }else{

      inst.y+=moveY;
      inst.y = Math.min(inst.y,world.y+world.height);
      inst.y = Math.max(inst.y,world.y);
    }
  }.bind(this), that = this;




  this.update = function(dt){

    objects.player.x = inst.x;
    objects.player.y = inst.y;
    inst.rx = inst.x-world.x;
    inst.ry = inst.y-world.y;

    inst.customUpdates.forEach(function(c){this[c].update(dt)}.bind(this));


    switch(key.lastkey[0]){

        case "KeyW":
          that.lastMove = "up"
        break;

        case "KeyA":
          that.lastRl = "left"
          that.lastMove = "left";
        break;

        case "KeyS":
          that.lastMove = "down";
        break;

        case "KeyD":
          that.lastRl = "right"
          that.lastMove = "right";
        break;
    }


    if(this.state === "moving"){

      var dtSpd = inst.spd*dt,
      moveX= 0, moveY=0;

      if(key.pressed.KeyW){

       moveY = -dtSpd;
      }

      if(key.pressed.KeyA){

       moveX = -dtSpd;
      }

      if(key.pressed.KeyS){

       moveY = dtSpd;
      }

      if(key.pressed.KeyD){

       moveX = dtSpd;
      }

      playerMove(moveX,moveY);




    }


    if(this.movingX === "world" ){

      if(((can.width/2)/gameScaleX)>=world.x+world.width){

        this.movingX = "playerRight";

      }else if(-((can.width/2)/gameScaleX)<=world.x){

        this.movingX = "playerLeft";

      }
    }else{


      var test = this.movingX === "playerRight"? inst.x<=0 : inst.x>=0;

      if(test){

        inst.x= 0;
        this.movingX = "world";

      }

    }

    if(this.movingY === "world"){


      if(-((can.height/2)/gameScaleY)<=world.y){

        this.movingY = "playerTop";

      }else if(((can.height/2)/gameScaleY)>= world.y+world.height ){


        this.movingY = "playerBottom";


      }

    }else{

      var test = this.movingY === "playerBottom"? inst.y<=0 : inst.y>=0;

      if(test){

        inst.y= 0;
        this.movingY = "world";

      }

    }



  };





    this.moveAnim = function(callback){

      switch(key.lastkey[0]){

          case "KeyW":
            pSprite.setSprite("up");
          break;

          case "KeyA":
            pSprite.setSprite("left");
          break;

          case "KeyS":
            pSprite.setSprite("down");
          break;

          case "KeyD":
            pSprite.setSprite("right");
          break;

          default: callback();

      }
    }


    this.player = {


      update : function(){

        that.moveAnim(function(){
          pSprite.setSprite("idle"+that.lastRl.replace(/\w/,m=>m.toUpperCase()));
        })
      }
    }


    this.attack= function(callback){

      if(key.pressed.Space){
            that.state = "attacking"
            if(callback)callback();
            switch(that.lastMove){

              case "up":
                pSprite.setSprite("attackUp");
                that.pushAngle = -Math.PI/2
              break;

              case "left":
                pSprite.setSprite("attackLeft");
                that.pushAngle = Math.PI
              break;

              case "down":
                pSprite.setSprite("attackDown");
                that.pushAngle = Math.PI/2
              break;

              case "right":
                pSprite.setSprite("attackRight");
                that.pushAngle = 0
              break;

            }

        return true;
      }

    }

    this.slime = {

      canSuperSpd : 5,
      canSuper : 5,
      biteList : [],
      biteHitbox : {up:[-10,0,20,-20],down:[-10,0,20,20],right:[0,-10,20,20],left:[0,-10,-20,20]},
      biteCol : function(){

          objects.typeLoop(function(victim,vHitBox){

            if(rectInRect(victim.x+vHitBox[0],victim.y+vHitBox[1],vHitBox[2],vHitBox[3],
                          inst.x+this.biteHitbox[that.lastMove][0],
                          inst.y+this.biteHitbox[that.lastMove][1],
                          this.biteHitbox[that.lastMove][2],
                          this.biteHitbox[that.lastMove][3]) && !this.biteList.includes(victim.id)){
              if(victim.type==="bunny"){

                victim.brain.kill();
              }else{
                var a = getAngle(inst.x,inst.y,victim.x,victim.y);
                victim.brain.hit(a,3,10)
                this.biteList.push(victim.id);
              }
            }
          }.bind(this),objects.enemies)

      },

    update : function(dt){

        if (that.state === "attacking"){

          let moveX = Math.cos(that.pushAngle)*that.force,
              moveY = Math.sin(that.pushAngle)*that.force;
          this.biteCol();
          playerMove(moveX,moveY);
          that.force-= 0.2;
          that.force = Math.max(0,that.force);
          if(inst.spr.done){

            inst.spr.setSprite("idle");
            that.state = "moving";
            this.biteList = [];
          }
        }else{

          that.moveAnim(function(){inst.spr.setSprite("idle")})
          that.attack(function(){that.force = 4});

          }

        if(key.pressed.Digit1 && this.canSuper>=this.canSuperSpd){

          let bulletNb = 100
            for(let i = 0; i<bulletNb; i++){

              objects.shoot(inst.rx,inst.ry,(Math.PI*2/bulletNb)*i,200,"bullet",0);

            }

            this.canSuper = 0;

        }else{  this.canSuper += this.canSuper>=this.canSuperSpd?0:dt};

      }
    }

    this.archer={

      counter:0,

      canShoot:true,

      update: function(dt){


        this.counter+=dt;

        if(key.mousedown){

          let angle = getMouseAngle(inst.rx,inst.ry-3), shootSpd = 0.49, anims;


            if(key.lastkey.length===0){

             anims = ["attackUp","attackLeft","attackDown","attackRight"];

            }else{

             anims = ["attackMoveUp","attackMoveLeft","attackMoveDown","attackMoveRight"];

            }

            inst.spr.setSprite(answerByAngle(angle,anims),0,1);

          if(inst.spr.currentFrame === 7){
            if(this.canShoot){
              objects.shoot(inst.rx,inst.ry-3,angle,500,"arrow")
              this.canShoot= false;
            }
          }else{

            this.canShoot = true;
          }

        }else{

          that.player.update();

        }
      }
    }

    this.robot={

      counter:0,
      reverse:0,
      doneFirst:0,
      lazer:null,
      endCode:function(){if(this.lazer){this.lazer.kill()}},

      update:function(dt){

         var d = {up:{x:0,y:-4},down:{x:3 ,y:3},right:{x:18,y:1},left:{x:-14,y:0}};

        if(that.state === "attacking"){

          if(this.doneFirst && !key.pressed.Space && !this.reverse ){

            pSprite.setSprite("r"+pSprite.currentSprite);
            this.reverse = 1;
            this.lazer.kill();
            this.lazer = null;
          }

          if(this.reverse){

            if(pSprite.done)that.state = "moving"

          }

          if(!this.doneFirst){

            if(pSprite.done){
              this.doneFirst = 1;
              this.lazer = objects.lazer(inst.rx+d[this.side].x,inst.ry+d[this.side].y,this.side);

            }

          }


        }else{



          if(key.mousedown){

            let angle = getMouseAngle(inst.rx,inst.ry-3), shootSpd = 0.4, anims= ["up","left","down","right"];

            if(key.lastkey.length===0)anims = ["idleUp","idleLeft","idleDown","idleRight"];

            let r =  answerByAngle(angle,anims);

            if((r === anims[0] && that.lastMove === "down")||
            (r=== anims[2] && that.lastMove === "up") ||
            (r=== anims[1] && that.lastMove === "right")||
            (r=== anims[3] && that.lastMove === "left")){
              inst.spr.setSprite(r,0,0,1);

            }else{
              inst.spr.setSprite(r,0,0);
            }

            if(this.counter >= shootSpd){

              let headPos = {}
              headPos[anims[0]] = [3,-7,0];//up
              headPos[anims[1]] = [0,-6,1];//left
              headPos[anims[2]] = [3,-6,1];//down
              headPos[anims[3]] = [5,-6,1];//right

              objects.addInstance({x:inst.rx+headPos[r][0],
                                   y:inst.ry+headPos[r][1],
                                   spr:new Sprite(16,16),
                                   type:"effect",
                                   defAnim:"lazerStart",
                                   drawOver:+headPos[r][2],
                                   follow:inst,name:"lazer",
                                   headPos:headPos[r]});
              this.counter = 0;
            }

            this.counter+= dt;

          }else{

            that.moveAnim(function(){

              pSprite.setSprite("idle"+that.lastMove.replace(/\w/,m=>m.toUpperCase()));
            })

          }

          that.attack(function(){this.counter=0; this.reverse = 0; this.doneFirst = 0; this.side = that.lastMove}.bind(this));

        }
      }
    },


    this.bunny = {


      update:function(dt){

        that.moveAnim(function(){

          pSprite.setSprite("idle"+that.lastMove.replace(/\w/,m=>m.toUpperCase()));
        })

      }

    }






}
