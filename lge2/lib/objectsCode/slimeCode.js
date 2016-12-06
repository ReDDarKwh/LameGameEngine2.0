
slimeCode = function(inst){

  this.inst = inst;
  this.path = new Path(inst,8,6),
  this.mode = "",
  this.ignoreDis = false;
  this.counter = 0,
  this.life = this. initialLife = 10;


  switch(objects.list[inst.type].insts.length){

    case 0:this.idlePath = this.originalPath =  paths.slimePaths.path1;
    break;
    case 1:this.idlePath = this.originalPath =  paths.slimePaths.path2;
    break;
  }

  let chaseDis = 125, lostDis = 250, attackCounter = 0, biteCounter = 0,biteTime = random.range(10,20),bitting=0,force=0,pushAngle=0, bit=0,
  biteHitbox = {up:[-10,0,20,-20],down:[-10,0,20,20],right:[0,-10,20,20],left:[0,-10,-20,20]},
  biteCol = function(angle){

    let attackSide = answerByAngle(angle,["up","left","down","right"]),victim = objects.player;

        if(rectInRect(victim.x+victim.hitbox[0],victim.y+victim.hitbox[1],victim.hitbox[2],victim.hitbox[3],
                      inst.x+biteHitbox[attackSide][0],
                      inst.y+biteHitbox[attackSide][1],
                      biteHitbox[attackSide][2],
                      biteHitbox[attackSide][3]) && ! bit){
          victim.brain.hit(2);
          bit=true;
        }


  };

  this.chase = function(){
    this.mode = "chasing";
    this.newPath("chasing",objects.player.rx,objects.player.ry);
    inst.spd = 30;
    inst.spr.spd = 0.07;
  }

  this.idle = function(){
    this.mode = "idle";
    if(this.idlePath){

      let smallIndex = 0;
      let small= this.idlePath.reduce(function(a,b,i){


        let disA = getDistance(inst.rx,inst.ry,a[0],a[1]);
        let disB = getDistance(inst.rx,inst.ry,b[0],b[1]);

        if(disA<disB){

          return a;
        }

        smallIndex = i;
        return b;
      })

      this.idlePath=this.idlePath.filter(function(c,i){return i>=smallIndex});

      this.newPath("getToPath",small[0],small[1]);
    }
    inst.spr.setSprite("idle");
    inst.spd = 200;
    inst.spr.spd = 0.15;
  };



  this.idle();


  this.update = function(dt){


    let distanceEnemyPlayer = getDistance(inst.rx,inst.ry,objects.player.rx,objects.player.ry);



    switch(this.mode){

      case "pushed":

        let moveX = Math.cos(this.pushAngle)*this.forceX,
        moveY = Math.sin(this.pushAngle)*this.forceY;

        this.inst.spr.setSprite("hit");
        this.move(moveX,moveY);

        if(inst.spr.done){

          if(this.life<=0 ){

            objects.removeInstance(inst);
          }

          if(this.forceX<=0 && this.forceY<=0){
           this.chase();
           this.ignoreDis = true;
          }
        }

      break;

      case "idle":

        if(this.idlePath){


          if(this.path.done){

            switch(this.path.name){

              case "getToPath":
                this.path.setPath("modPath",this.idlePath);
              break;
              case "modPath":
                this.idlePath = this.originalPath;
                this.path.setPath("idlePath",this.idlePath,1);
              break;
              case "idlePath":
                this.path.setPath("idlePath",this.idlePath,1);
              break;
            }
          }


          this.path.update(dt);
        }

        if(distanceEnemyPlayer<chaseDis){

          this.chase();
        }

      break;

      case "chasing":


        if(this.counter>=50/inst.spd || this.path.done){

          this.newPath("chasing",objects.player.rx,objects.player.ry);
          this.counter = 0;
        }

        this.counter+=dt;
        this.path.update(dt);

        if(distanceEnemyPlayer<=60){

          this.mode = "attacking";
          this.ignoreDis = false;
        }

        if(distanceEnemyPlayer>=lostDis && !this.ignoreDis){

          this.idle();
        }

      break;

      case "attacking":

        if(distanceEnemyPlayer>60 ){
          this.chase();
          bitting = 0;

        }

        let move =[0,0];

        if(bitting){

          inst.spr.setSprite(answerByAngle(pushAngle,["attackUp","attackLeft","attackDown","attackRight"]));
          biteCol(pushAngle);
          force-=0.01
          force = Math.max(0,force);
          if(inst.spr.done){
            bit = 0;
            force = 0;
            bitting=0;
          }else{

           move[0] = Math.cos(pushAngle)*force;
           move[1] = Math.sin(pushAngle)*force;

          }
        }else{

          let angle = getAngle(objects.player.rx,objects.player.ry,inst.rx+move[0],inst.ry+move[1]),spd = inst.spd*dt,
          dis = getDistance(inst.rx+move[0],inst.ry+move[1],objects.player.rx,objects.player.ry);

          let f = (spd *(40-dis))<0? Math.max(spd * (40-dis),-spd) : Math.min(spd * (40-dis),spd)

          move[0] += Math.cos(angle)* f;
          move[1] += Math.sin(angle)* f;

          if(Math.abs(f)>0.1){inst.spr.setSprite(answerByAngle(angle,
          f<0?["down","right","up","left"]:["up","left","down","right"]))}else{inst.spr.setSprite("idle")}


          objects.typeLoop(function(c){

            if(inst.id!==c.id){

              let dis = getDistance(inst.rx,inst.ry,c.rx,c.ry);
              let angle = getAngle(inst.rx,inst.ry,c.rx,c.ry);
              let radius = 10;
              if(dis<radius){
                move[0]+= Math.cos(angle)*(spd*(Math.max(dis-radius,-1)));
                move[1]+= Math.sin(angle)*(spd*(Math.max(dis-radius,-1)));
              }
            }

          },["slime"])

        }

        this.move(move[0],move[1]);


        if(attackCounter>=1){

          objects.shoot(inst.rx,inst.ry,getAngle(inst.rx,inst.ry,objects.player.rx,objects.player.ry),40,"bullet",1,0,"enemy");

          attackCounter = 0;
        }

        if(biteCounter>=biteTime){

          bitting = true;
          force=2;
          pushAngle = getAngle(inst.x,inst.y,objects.player.x,objects.player.y);
          biteCounter = 0;
          biteTime = random.range(10,20);
        }
        attackCounter+=dt;
        biteCounter+=dt;

      break;
    }

    this.badGuyUpdate();

  }
}

slimeCode.prototype = objects.badGuys;
