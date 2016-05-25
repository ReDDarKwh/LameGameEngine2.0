
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
  this.extra = extra;
 
  if(type==="enemy"){
    
    this.extra.wc = {x:world.x,y:world.y};
    this.extra.path = new Path(this);
    
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
      debug.enemies.innerHTML = this.list.enemy[0].length;
      debug.bullets.innerHTML = this.list.projectile[0].length;
      
      
      
  },
    
    
  removeInstance : function(type,id){
      
    for(var i=0; i< this.list[type][0].length;i++){
        
      if(this.list[type][0][i].id ===id){
        break;
      }
    }
      
    this.list[type][0].splice(i,1);
     debug.enemies.innerHTML = this.list.enemy[0].length;
     debug.bullets.innerHTML = this.list.projectile[0].length;
  },
    
    
  addType : function(type,relativeToWorld){
      
    this.list[type]= [[],[],relativeToWorld] ;
    return type;
  },
  
  update : {
    
    "player":function(inst,dt){
      
      var dtSpd = Math.round(inst.spd*dt),
      moveX= 0, moveY=0;
      
      
      if(key.pressed[key.W]){
        
       moveY = -dtSpd;
      }

      if(key.pressed[key.A]){
 
       moveX = -dtSpd;
      }
           
      if(key.pressed[key.S]){
   
       moveY = dtSpd;
      }
 
      if(key.pressed[key.D]){
             
       moveX = dtSpd;
      }
      
      var col = world.col.playerCheckCollisions(0,0,moveX,moveY,6,5), colX = col[0] , colY = col[1];
      
      if(colX)moveX=0;
      if(colY)moveY=0;
      
      world.x-=moveX;
      world.y-=moveY;
      
        
      if(key.mousedown && inst.extra.canShoot>=inst.extra.shootSpd){
            
          
          objects.addInstance(inst.x-world.x,inst.y-world.y,
                              new Sprite("bullet",16,16,0.12,8,8,getMouseAngle(inst.x,inst.y),0),
                              "projectile",100,{direction:getMouseDir(0 ,0)});
          inst.extra.canShoot=0;
          
      }else{
        
        inst.extra.canShoot+=dt;
      }
        
      var pSprite =  inst.ima;
        
      switch(key.lastkey[0]){
 
        case key.W: pSprite.setSprite("up");
        break;
   
        case key.A: pSprite.setSprite("left");
        break;
   
        case key.S: pSprite.setSprite("down");
        break;
   
        case key.D: pSprite.setSprite("right");
        break;
 
        default: pSprite.setSprite("idle");
      }
    },
      
    "projectile": function(inst,dt){
        
      if(inst.ima.alpha<1){
        inst.ima.alpha+=0.1;
      }
        
        
      inst.rx+= inst.extra.direction[0]*inst.spd*dt;
      inst.ry+= inst.extra.direction[1]*inst.spd*dt;
        
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
        
      var pSprite =  inst.ima;
        
      var angle = inst.extra.path.angle*(180/Math.PI);
      switch(true){
  
        case (angle > -135 && angle < -45): pSprite.setSprite("up");
        break;
    
        case (angle < -135 && angle > -180 || angle> 135 && angle<=180): pSprite.setSprite("left");
        break;
    
        case (angle < 135 && angle > 45): pSprite.setSprite("down");
        break;
    
        case (angle > -45 && angle < 0 || angle< 45 && angle>=0): pSprite.setSprite("right");
        break;
  
        default: pSprite.setSprite("idle");
      }
      
      
    
      if(inst.ima.alpha<1){
        inst.ima.alpha+=0.05;
      }
      
      
      
      if((world.x!= inst.extra.wc.x || world.y!= inst.extra.wc.y)){
        
<<<<<<< HEAD
       inst.extra.path.setPath(astar.run(world.colMap,{x:Math.floor(inst.rx/world.tileSize),y:Math.floor(inst.ry/world.tileSize)},{x:Math.floor(world.x*-1/world.tileSize),y:Math.floor(world.y*-1/world.tileSize)}));
=======
        setTimeout(inst.extra.path.setPath(astar.run(world.colMap,{x:Math.floor(inst.rx/world.tileSize),y:Math.floor(inst.ry/world.tileSize)},{x:Math.floor(world.x*-1/world.tileSize),y:Math.floor(world.y*-1/world.tileSize)}));)
>>>>>>> 72c808774868b8fa1fe9d107e9dd9b0036d922fe
        
      }
      
      inst.extra.wc.x = world.x;
      inst.extra.wc.y = world.y;
    
      inst.extra.path.update(dt);
      
      
    
      objects.list.projectile[0].forEach(function(c){
        
        if(checkCol(inst.x,inst.y,5,5,c.x,c.y,2,2)){
          
          objects.removeInstance("enemy",inst.id);
          objects.removeInstance("projectile",c.id);
        }
      });
      
      
      
      
      
      
        
      /*
      var s = inst.spd*dt*inst.extra.dir;
      inst.rx += s;
      
      if(inst.x+s<world.x){
        inst.extra.dir = 1;
        inst.ima.setSprite("right");
      }
      if(inst.x+s>world.x+world.width){
        inst.extra.dir = -1;
        inst.ima.setSprite("left");
      }
      
      
    */
    
    }
  }
};