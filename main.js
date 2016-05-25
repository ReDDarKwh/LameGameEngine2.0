window.onload= function(){
  
  
  var stats = new Stats();
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );
//  document.getElementById("div").style.left = can.getBoundingClientRect().left.toString()+"px";
  

  world.init(worldData);
  

  objects.addType("projectile",true);
  objects.addType("player",false);
  objects.addType("enemy",true);
  
  
  let slimeAnims = [{name:"up",dir:"spr_slime_up.png",anim:[0,1,2,3]},
                    {name:"left",dir:"spr_slime_rl.png",anim:[3,2,1,0]},
                    {name:"down",dir:"spr_slime_down.png",anim:[0,1,2,3]},
                    {name:"right",dir:"spr_slime_rl.png",anim:[4,5,6,7]},
                    {name:"idle",dir:"spr_slime_idle.png",anim:[0,1,2,3]}];
  
  
  objects.addSpriteToType("player",slimeAnims);
  
  objects.addSpriteToType("enemy",slimeAnims);

  
  objects.addSpriteToType("projectile",[{name:"bullet",dir:"spr_slime_projectile.png",anim:[0,1,2]}]);
   
   
   
  objects.addInstance(0,0,new Sprite("idle",32,32,0.07,16,16),"player",40,{canShoot:1,shootSpd:0.2});
 
  objects.addInstance(0,0,new Sprite("left",32,32,0.15,16,16),"enemy",50,{dir:-1});

/*
  for(let i = 0; i<2000;i++){
    objects.addInstance(0,random.r(world.height),new Sprite("left",32,32,1,16,16),"enemy",random.range(10,100),{dir:-1})
  }
*/

  
  function update(dt){
    
    for (let i in objects.list) {
      
      objects.list[i][0].forEach(function(c){
      
        if(objects.update[i]){//run custom update of the type if there is one.
          
          objects.update[i](c,dt/1000);
        }
        
        if(objects.list[i][2]){//update coords to be relative to the world if relativeToWorld is true;
          
          c.x = world.x+c.rx;
          c.y = world.y+c.ry;
        }
        
        c.ima.update(dt);
      });
    }
  }
  
  
  function render(dt){
    
    ctx.clearRect(-can.width/2,-can.height/2,can.width,can.height);
  
    world.draw();
     
    for (let i in objects.list) {
      
      objects.list[i][0].forEach(function(c){
      
        c.ima.draw(c.x,c.y);
      });
    }
 
 
    //drawPath(objects.list.enemy[0][0].extra.path.path||[]);
 
 
  }
  
  
  var then =  Date.now();
  
  function tick(){
    stats.begin();
    var now = Date.now(), dt = now - then>30?30:now - then;
    
    then = now;
      

    update(dt);
    render(dt);
    
    stats.end();
    run(tick);
  }
  
  run(tick);
};
  



function drawPath(path){
  
  ctx.beginPath();
  for(let i= 0; i < path.length-1;i++){
    
    ctx.moveTo(path[i][0]+world.x,path[i][1]+world.y);
    ctx.lineTo(path[i+1][0]+world.x,path[i+1][1]+world.y);
  }
  ctx.stroke();
  
  
}
 
    //no bugs plz...

