




  var stats = new Stats();
  stats.showPanel( 0 );
  document.body.appendChild( stats.dom );
  initUican();

  let xemosAnims=[

    {name:"up",path:"xemos/spr_xemos_up.png",anim:"0-3"},
    {name:"left",path:"xemos/spr_xemos_rl.png",anim:"3-0"},
    {name:"down",path:"xemos/spr_xemos_down.png",anim:"0-3"},
    {name:"right",path:"xemos/spr_xemos_rl.png",anim:"4-7"},
    {name:"idleRight",path:"xemos/spr_xemos_idle.png",anim:"4-7"},
    {name:"idleLeft",path:"xemos/spr_xemos_idle.png",anim:"3-0"}

  ]

  let slimeAnims = [
    {name:"up",path:"slime/spr_slime_up.png",anim:"0-3"},
    {name:"left",path:"slime/spr_slime_rl.png",anim:"3-0"},
    {name:"down",path:"slime/spr_slime_down.png",anim:"0-3"},
    {name:"right",path:"slime/spr_slime_rl.png",anim:"4-7"},
    {name:"idle",path:"slime/spr_slime_idle.png",anim:"0-3"},

    {name:"hit",path:"slime/spr_slime_hit.png",anim:"0-5",loop:0,spd:0.05},
    {name:"attackLeft",path:"slime/spr_slime_attack_rl.png",anim:"13,12,11,10,10,9,9,8,7,6,5,4,3,2,1,0",loop:0,spd:0.03,dimention:{w:100,h:100}},
    {name:"attackRight",path:"slime/spr_slime_attack_rl.png",anim:"14,15,16,17,17,18,18,19,20,21,22,23,24,25,26,27",loop:0,spd:0.03,dimention:{w:100,h:100}},
    {name:"attackUp",path:"slime/spr_slime_attack_up.png",anim:"0,1,2,3,3,4,4,5,6,7,8,9,9,10,11,12",loop:0,spd:0.03,dimention:{w:100,h:100}},
    {name:"attackDown",path:"slime/spr_slime_attack_down.png",anim:"0,1,2,3,3,4,4,5,6,7,8,9,9,10,11,12",loop:0,spd:0.03,dimention:{w:100,h:100}}
  ];

  let archerAnims = [

    {name:"up",path:"archer/movement/spr_archer_up.png",anim:"0-3",spd:0.14},
    {name:"left",path:"archer/movement/spr_archer_rl.png",anim:"0-7"},
    {name:"down",path:"archer/movement/spr_archer_down.png",anim:"0-3",spd:0.14},
    {name:"right",path:"archer/movement/spr_archer_rl.png",anim:"15-8"},
    {name:"idleRight",path:"archer/movement/spr_archer_idle.png",anim:"2,3",spd:0.28},
    {name:"idleLeft",path:"archer/movement/spr_archer_idle.png",anim:"1,0",spd:0.28},

    {name:"attackMoveUp",path:"archer/attack/spr_archer_attackMove_up.png",anim:"0-7"},
    {name:"attackMoveLeft",path:"archer/attack/spr_archer_attackMove_rl.png",anim:"0-7"},
    {name:"attackMoveDown",path:"archer/attack/spr_archer_attackMove_down.png",anim:"0-7"},
    {name:"attackMoveRight",path:"archer/attack/spr_archer_attackMove_rl.png",anim:"15-8"},

    {name:"attackUp",path:"archer/attack/spr_archer_attack_up.png",anim:"0-7"},
    {name:"attackLeft",path:"archer/attack/spr_archer_attack_rl.png",anim:"0-7"},
    {name:"attackDown",path:"archer/attack/spr_archer_attack_down.png",anim:"0-7"},
    {name:"attackRight",path:"archer/attack/spr_archer_attack_rl.png",anim:"15-8"},

  ]

  let raspd = 0.02;

  let robotAnims = [

    {name:"up",path:"robot/movement/spr_robot_up.png",anim:"0-7"},
    {name:"left",path:"robot/movement/spr_robot_rl.png",anim:"12-0",spd:0.035},
    {name:"down",path:"robot/movement/spr_robot_down.png",anim:"0-7"},
    {name:"right",path:"robot/movement/spr_robot_rl.png",anim:"13-25",spd:0.035},
    {name:"idleRight",path:"robot/movement/spr_robot_idle_rl.png",anim:"2,3",spd:0.2},
    {name:"idleLeft",path:"robot/movement/spr_robot_idle_rl.png",anim:"1,0",spd:0.2},
    {name:"idleUp",path:"robot/movement/spr_robot_idle_up.png",anim:"1,0",spd:0.2},
    {name:"idleDown",path:"robot/movement/spr_robot_idle_down.png",anim:"1,0",spd:0.2},

    {name:"attackUp",path:"robot/attack/spr_robot_attack_up.png",anim:"0,1,2,3,4,5,6,7,8,9,10,11,11",loop:0,spd:raspd},
    {name:"attackLeft",path:"robot/attack/spr_robot_attack_rl.png",anim:"12-0",loop:0,ox:29,oy:32,spd:raspd},
    {name:"attackDown",path:"robot/attack/spr_robot_attack_down.png",anim:"0,1,2,3,4,5,6,7,8,9,10,11,11",loop:0,spd:raspd},
    {name:"attackRight",path:"robot/attack/spr_robot_attack_rl.png",anim:"13-25",loop:0,spd:raspd},

    {name:"rattackUp",path:"robot/attack/spr_robot_attack_up.png",anim:[0,1,2,3,4,5,6,7,8,11,11].reverse(),loop:0,spd:raspd},
    {name:"rattackLeft",path:"robot/attack/spr_robot_attack_rl.png",anim:"0,1,2,3,4,5,6,7,8,11,12",loop:0,ox:29,oy:32,spd:raspd},
    {name:"rattackDown",path:"robot/attack/spr_robot_attack_down.png",anim:[0,1,2,3,4,5,6,7,8,11,11].reverse(),loop:0,spd:raspd},
    {name:"rattackRight",path:"robot/attack/spr_robot_attack_rl.png",anim:"25,24,23,22,21,20,19,18,17,14,13",loop:0,spd:raspd},


  ]

  let bunnyAnims = [

    {name:"up",path:"bunny/spr_bunny_up.png",anim:"0-3"},
    {name:"left",path:"bunny/spr_bunny_rl.png",anim:"0-3"},
    {name:"down",path:"bunny/spr_bunny_down.png",anim:"0-3"},
    {name:"right",path:"bunny/spr_bunny_rl.png",anim:"7-4"},
    {name:"idleRight",path:"bunny/spr_bunny_rl.png",anim:"7"},
    {name:"idleLeft",path:"bunny/spr_bunny_rl.png",anim:"0"},
    {name:"idleDown",path:"bunny/spr_bunny_down.png",anim:"0"},
    {name:"idleUp",path:"bunny/spr_bunny_up.png",anim:"0"},

  ]

  objects.addType("player",xemosAnims,{hitbox:[-3,-9,7,17],wHitbox:[-5,5],spd:60,updates:["player"]});
  objects.addType("slime",slimeAnims,{hitbox:[-6,-5,12,10],wHitbox:[-5,0],spd:30,updates:["slime"]});
  objects.addType("robot",robotAnims,{hitbox:[-1,-8,8,21],wHitbox:[-3,8],spd:40,updates:["robot"]});
  objects.addType("archer",archerAnims,{hitbox:[-5,-9,8,18],wHitbox:[-7,5],spd:70,updates:["archer"]});
  objects.addType("bunny",bunnyAnims,{hitbox:[-4,-3,8,7],wHitbox:[-6,-1],spd:90,updates:["bunny"]});


  objects.addType("projectile",[
   {name:"bullet",path:"slime/spr_slime_projectile.png",anim:"0-2"},
   {name:"arrow",path:"archer/spr_archer_projectile.png",anim:"0"},
   {name:"lazer",path:"robot/spr_robot_projectile.png",anim:"0",oy:8,dimention:{w:32,h:16}},]);

  objects.addType("lazer",
  [{name:"lazerStart",path:"robot/attack/blast/lazer_start.png",anim:"0-10",loop:0,ox:32,oy:32},
  {name:"lazer",path:"robot/attack/blast/lazer2.png",anim:"0-4",loop:0,ox:0}]);

  objects.addType("effect",
  [{name:"lazerStart",path:"robot/spr_robot_projectile_start.png",anim:"0,1",loop:0,spd:0.02},
   {name:"bunnyBit0",path:"bunny/spr_bunny_bits.png",anim:"0"},
   {name:"bunnyBit1",path:"bunny/spr_bunny_bits.png",anim:"1"},
   {name:"bunnyBit2",path:"bunny/spr_bunny_bits.png",anim:"2"},
   {name:"bunnyBit3",path:"bunny/spr_bunny_bits.png",anim:"3"},
   {name:"bunnyBit4",path:"bunny/spr_bunny_bits.png",anim:"4"}]);


  world.init(worldData);

  objects.player = objects.addInstance({x:60*16,y:12*16,spr:new Sprite(32,32,0.07),type:"player",defAnim:0});
  objects.addInstance({x:43*16,y:25*16,spr:new Sprite(32,32,0.15,0,0),type:"slime"});
  objects.addInstance({x:55*16,y:25*16,spr:new Sprite(32,32,0.15,0,0),type:"slime"});

  changeScale(-3);

  function update(dt){

    objects.cleanUp();

    objects.player.brain.update(dt);
    objects.player.spr.update(dt);

    for (let type in objects.list) {

      if(type === "player")continue;

      objects.list[type].insts.forEach(function(c){

        if(c.brain.update)c.brain.update(dt);

          c.x = world.x+c.rx;
          c.y = world.y+c.ry;

        c.spr.update(dt);
      });
    }

    objects.ySort();

  }


  //cursor = new Image();
  //cursor.src = "assets/cursor.png";

  function render(){

    ctx.clearRect(-can.width/2,-can.height/2,can.width,can.height);
    uictx.clearRect(0,0,uican.width,uican.height);

    world.draw();



    objects.objectsYorder.forEach(function(c){
      c.spr.draw(c.x,c.y);
      if(c.brain.drawLife)c.brain.drawLife();

     /*
     if(c.type==="player")ctx.strokeRect(c.x+c.wHitbox[0],
      c.y+c.wHitbox[1],c.wHitbox[2],c.wHitbox[3])
    ctx.beginPath();
     ctx.arc(c.x,c.y,1,0,2*Math.PI);
     ctx.fill();


     if(c.type === "slime"){
       let bh = {up:[-10,0,20,-20],down:[-10,0,20,20],right:[0,-10,20,20],left:[0,-10,-20,20]};
       ctx.strokeRect(c.x+bh.up[0],c.y+bh.up[1],bh.up[2],bh.up[3]);
       ctx.strokeRect(c.x+bh.down[0],c.y+bh.down[1],bh.down[2],bh.down[3])
       ctx.strokeRect(c.x+bh.left[0],c.y+bh.left[1],bh.left[2],bh.left[3])
       ctx.strokeRect(c.x+bh.right[0],c.y+bh.right[1],bh.right[2],bh.right[3])

     }
     */

    });

    objects.objectsOver.forEach(function(c){
      c.spr.draw(c.x,c.y);
    })

    let viewDis = 350, attackDis = 250, attackStopDis = 150;
    ctx.beginPath();
    ctx.arc(objects.player.x,objects.player.y,viewDis,0,2*Math.PI)
    ctx.arc(objects.player.x,objects.player.y,attackDis,0,2*Math.PI)
    ctx.arc(objects.player.x,objects.player.y,attackStopDis,0,2*Math.PI)
    ctx.stroke();

    //draw cursor
  /*
    let hitbox = objects.player.brain.worldHitbox;
    ctx.strokeRect(objects.player.x+hitbox[0],objects.player.y+hitbox[1],hitbox[2],hitbox[3])
*/
   /*
    uictx.save();
      uictx.translate(key.canMouseX,key.canMouseY);
      uictx.rotate(-45*(Math.PI/180));
      uictx.drawImage(cursor,(-cursor.width*1.8)/2,0,cursor.width*1.8,cursor.height*1.8)
    uictx.restore();
  */
  }


  var then =  Date.now();

  function tick(){
    stats.begin();
    var now = Date.now(), dt = now - then>30?30:now - then;

    then = now;


    update(dt/1000);
    render();

    stats.end();
    window.requestAnimationFrame(tick);
  }

  window.requestAnimationFrame(tick);




function drawPath(path){

  ctx.beginPath();
  for(let i= 0; i < path.length-1;i++){

    ctx.moveTo(path[i][0]+world.x,path[i][1]+world.y);
    ctx.lineTo(path[i+1][0]+world.x,path[i+1][1]+world.y);
  }
  ctx.stroke();


}

    //no bugs plz...
