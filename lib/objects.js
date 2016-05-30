
function Obj(type,x,y,ima,spd,id,relativeToWorld,extra){

  if(relativeToWorld){

    this.rx = x;
    this.ry = y;
    this.x = world.x+this.rx;
    this.y = world.y+this.ry;
  }else{

    this.x = x;
    this.y = y;
  }

  this.ima = ima;
  this.spd = spd;
  this.id = id;
  this.extra = extra||{};

  switch(type){
     
    case "player":
      
      this.extra.movingX = "world";
      this.extra.movingY = "world";
      
    break;
    case "enemy":
      this.extra.wc = {x:world.x,y:world.y};
      this.extra.path = new Path(this);
      this.extra.mode = "dumbChase";
      this.extra.c = 0;
      this.extra.moved = 0;
      this.extra.angle = 0;
      this.extra.force = 0;
      this.extra.life = 3;
    break;

    case "dumbSlime":

      this.extra.angle = 0;
      this.extra.force = 0;
      this.extra.dir = 1;

    break;

    case "projectile":
      this.extra.direction = getMouseAngle(0 ,0);
      this.extra.gravity = 0;
    break;

  }



}

var objects = {

  list : {},
  objectNum : 0,

  addSpriteToType(type,sprites){


    sprites.forEach(addSprite.bind(this));

    function addSprite(sprite){
      this.list[type][1].push(sprite);

      this.list[type][0].forEach(function(c){
        c.ima.addSprite(sprite.name,sprite.dir,sprite.anim);
      });
    }

  },

  addInstance : function(x,y,ima,type,spd,extra){

    this.list[type][1].forEach(function(c){

      ima.addSprite(c.name,c.dir,c.anim);
    });


    this.list[type][0].push(new Obj(type,x,y,ima,spd,this.objectNum,this.list[type][2],extra));
    this.objectNum++;
      //return this.list[type][0][this.list[type].length - 1];
      debug.enemies.innerHTML = this.list.dumbSlime[0].length;
      debug.bullets.innerHTML = this.list.projectile[0].length;



  },


  removeInstance : function(type,id){

    for(var i=0; i< this.list[type][0].length;i++){

      if(this.list[type][0][i].id ===id){
        break;
      }
    }

    this.list[type][0].splice(i,1);
     debug.enemies.innerHTML = this.list.dumbSlime[0].length;
     debug.bullets.innerHTML = this.list.projectile[0].length;
  },


  addType : function(type,relativeToWorld){

    this.list[type]= [[],[],relativeToWorld] ;
    return type;
  },

  update : {

    "dumbSlime":function(inst,dt){

      objects.list.projectile[0].forEach(function(c){

        if(checkCol(inst.x,inst.y,5,5,c.x,c.y,2,2)){

            inst.extra.angle = c.extra.direction;
            inst.extra.force+=2;

          objects.removeInstance("projectile",c.id);
        }
      });

      var s = inst.spd*dt*inst.extra.dir;

      inst.rx+=Math.cos(inst.extra.angle)*inst.extra.force+s;
      inst.ry+=Math.sin(inst.extra.angle)*inst.extra.force;

      inst.extra.force-=0.1;
      inst.extra.force = Math.max(inst.extra.force,0);

      if(inst.x+s<world.x){
        inst.extra.dir = 1;
        inst.ima.setSprite("right");
      }
      if(inst.x+s>world.x+world.width){
        inst.extra.dir = -1;
        inst.ima.setSprite("left");
      }


    },

    "player":function(inst,dt){

      var dtSpd = Math.round(inst.spd*dt),
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

      
      
      
      
      
      

      var col = world.col.playerCheckCollisions(inst.x,inst.y,moveX,moveY,6,5), colX = col[0] , colY = col[1];

      if(colX)moveX=0;
      if(colY)moveY=0;




      if(inst.extra.movingX === "world" ){
        
       world.x-=moveX;
      
        
      }else{
        
       inst.x+=moveX;
        
      }
      
      if(inst.extra.movingY === "world"){
        
        world.y-=moveY;
        
      }else{
        
        inst.y+=moveY;
        
      }


      if(inst.extra.movingX === "world" ){

        if(((can.width/2)/gameScaleX)>world.x+world.width){
  
          inst.extra.movingX = "playerRight";
          
        }else if(-((can.width/2)/gameScaleX)<world.x){
      
          inst.extra.movingX = "playerLeft";
    
        }
      }else{
        
       
        var test = inst.extra.movingX === "playerRight"? inst.x<=0 : inst.x>=0;
        
        if(test){
          
          inst.x= 0;
          inst.extra.movingX = "world";
          
        }
          
      }
      
      
      if(inst.extra.movingY === "world"){
      
      
        if(-((can.height/2)/gameScaleY)<world.y){
  
          inst.extra.movingY = "playerTop";
          
    
        }else if(((can.height/2)/gameScaleY)> world.y+world.height ){
          
          
          inst.extra.movingY = "playerBottom";
          
          
        }
      
      }else{
        
        var test = inst.extra.movingY === "playerBottom"? inst.y<=0 : inst.y>=0;
        
        if(test){
          
          inst.y= 0;
          inst.extra.movingY = "world";
          
        }
        
      }

       console.log(key.mouseY);
     // world.y = Math.min(world.y,-((can.height/2)/gameScaleY));
     // world.x = Math.min(world.x,-((can.width/2)/gameScaleX));

      if(key.mousedown && inst.extra.canShoot>=inst.extra.shootSpd){


          objects.addInstance(inst.x-world.x,inst.y-world.y,
                              new Sprite("bullet",16,16,0.12,8,8,getMouseAngle(inst.x,inst.y),0),
                              "projectile",200);
          inst.extra.canShoot=0;

      }else{

        inst.extra.canShoot+=dt;
      }

      var pSprite =  inst.ima;

      switch(key.lastkey[0]){

        case "KeyW": pSprite.setSprite("up");
        break;

        case "KeyA": pSprite.setSprite("left");
        break;

        case "KeyS": pSprite.setSprite("down");
        break;

        case "KeyD": pSprite.setSprite("right");
        break;

        default: pSprite.setSprite("idle");
      }
    },

    "projectile": function(inst,dt){

      if(inst.ima.alpha<1){
        inst.ima.alpha+=0.1;
      }


      inst.rx+= Math.cos(inst.extra.direction)*inst.spd*dt;
      inst.ry+= Math.sin(inst.extra.direction)*inst.spd*dt+inst.extra.gravity;
      
      inst.extra.gravity+=0.1;
      
      

      if(inst.x<world.x ||
         inst.y<world.y ||
         inst.x>world.x+world.width||
         inst.y>world.y+world.height){

        setTimeout(function(){objects.removeInstance("projectile",inst.id)},125);
      }

      if( world.col.checkCollisions(inst.x,inst.y,2,2,["trees"])){

        objects.removeInstance("projectile",inst.id);
      }
    },

    "enemy": function(inst,dt){

      var distanceEnemyPlayer = getDistance(inst.x,inst.y,0,0);

      function newPath(){
        inst.extra.path.setPath(astar.run(world.colMap,
        {x:Math.floor(inst.rx/world.tileSize),y:Math.floor(inst.ry/world.tileSize)},
        {x:Math.floor(world.x*-1/world.tileSize),y:Math.floor(world.y*-1/world.tileSize)}));
        inst.extra.moved=0;
      }


      if(inst.extra.mode != "push"){
        if(distanceEnemyPlayer<60 ){

          inst.extra.mode = "dumbChase";

        }else if(inst.extra.mode != "smartChase"){

          inst.extra.mode = "smartChase";

          newPath();
        }
      }

      if(inst.ima.alpha<1){
        inst.ima.alpha+=0.05;
      }

      if(inst.extra.mode === "smartChase"){

        animByAngle(inst.extra.path.angle);


        let x = world.x, y = world.y;

        if(Math.abs(x-inst.extra.wc.x)>=20 || Math.abs(y-inst.extra.wc.y)>=20){

        inst.extra.moved=1;
        console.log("moved!");

          inst.extra.wc.x=x;
          inst.extra.wc.y=y;
        }

        if(inst.extra.c>=50/inst.spd || inst.extra.path.done){


          if(inst.extra.moved){
            newPath();
          }

          inst.extra.c = 0;
        }


        inst.extra.c+=dt;


        inst.extra.path.update(dt);


      }else if (inst.extra.mode === "dumbChase"){


        let move = objects.typeCollide("enemy",inst,6);

        var angle = getAngle(inst.rx+move[0],inst.ry+move[1],world.x*-1,world.y*-1);


        inst.ima.setSprite("idle");
        let dis = getDistance(inst.rx+move[0],inst.ry+move[1],world.x*-1,world.y*-1);

        var spd = ((dis-30)*dt)>inst.spd*dt?inst.spd*dt:((dis-30)*dt);

        move[0] += Math.cos(angle)*spd;
        move[1] += Math.sin(angle)*spd;

        enemyTileCol(move[0],move[1]);

      }else if (inst.extra.mode === "push"){

         let moveX = Math.cos(inst.extra.angle)*inst.extra.force,
             moveY = Math.sin(inst.extra.angle)*inst.extra.force;

         if(enemyTileCol(moveX,moveY)){
           inst.extra.force = 0;
         }
         animByAngle(inst.extra.angle+Math.PI);

         inst.extra.force-=0.1;
         if(inst.extra.force<=0){

           inst.extra.mode = "dumbChase";
         }
      }


      function enemyTileCol(moveX,moveY){

        var col = world.col.playerCheckCollisions(inst.x,inst.y,moveX,moveY,6,5), colX = col[0] , colY = col[1],collided=false;

        if(!colX && !colY){
          inst.extra.cantCollide=false;
        }


        if(colX)moveX=0;
        if(colY)moveY=0;

        if(colX || colY){
          collided = true;
        }

        inst.rx += moveX;
        inst.ry += moveY;

        return collided;
      }

      function animByAngle(angle){

        var pSprite =  inst.ima;
        angle *=(180/Math.PI);
        switch(true){

          case (angle >= -135 && angle <= -45): pSprite.setSprite("up");
          break;

          case (angle < -135 && angle > -180 || angle> 135 && angle<=180): pSprite.setSprite("left");
          break;

          case (angle <= 135 && angle >= 45): pSprite.setSprite("down");
          break;

          case (angle > -45 && angle < 0 || angle< 45 && angle>=0): pSprite.setSprite("right");
          break;

          default: pSprite.setSprite("idle");
        }

      }



      objects.list.projectile[0].forEach(function(c){

        if(checkCol(inst.x,inst.y,5,5,c.x,c.y,2,2)){


          inst.extra.angle = c.extra.direction;
          inst.extra.force+=2;
          inst.extra.mode = "push";

          inst.extra.life--;
          if(inst.extra.life<=0){
            objects.removeInstance("enemy",inst.id);
          }

          objects.removeInstance("projectile",c.id);
        }
      });



    }
  },

  typeCollide(type,obj,radius){

    let moveX=0,moveY=0;

    this.list[type][0].forEach(function(current){

      if(obj.id!==current.id){

        let dis = getDistance(obj.rx,obj.ry,current.rx,current.ry);

        if(dis < radius*2){

          let angle = getAngle(current.rx,current.ry,obj.rx,obj.ry),move = 2*radius-dis;

          moveX+= Math.cos(angle)*(move/(radius*10));
          moveY+= Math.sin(angle)*(move/(radius*10));



        }
      }
    })

    return[moveX,moveY];
  }

};
