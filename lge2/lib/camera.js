
function changeScale(n){

  var inst = objects.list.player.insts[0];

  world.x-=inst.x;
  world.y-=inst.y;
  inst.x-=inst.x;
  inst.y-=inst.y;

  if(gameScaleX+n>0 && gameScaleY+n>0 && gameScaleX+n <= 10 && gameScaleY+n <= 10){
    gameScaleX+=n;
    gameScaleY+=n;
    ctx.resetTransform()
    ctx.translate(can.width/2,can.height/2);
    ctx.scale(gameScaleX,gameScaleY)
  }

  if(world.y+world.height< (can.height/2)/gameScaleY){

    let l = world.y+world.height-(can.height/2)/gameScaleY;
    world.y = ((can.height/2)/gameScaleY)-world.height;
    inst.y-=l;
    inst.brain.movingY ="playerBottom";
  }

  if(world.y> -(can.height/2)/gameScaleY){

    let l = -(can.height/2)/gameScaleY-world.y;
    world.y = -((can.height/2)/gameScaleY);
    inst.y+=l;
    inst.brain.movingY ="playerTop";
  }

  if(world.x+world.width< (can.width/2)/gameScaleX){

    let l = world.x+world.width-(can.width/2)/gameScaleX;
    world.x = ((can.width/2)/gameScaleX)-world.width;
    inst.x-=l;
    inst.brain.movingX ="playerRight";
  }

  if(world.x> -(can.width/2)/gameScaleX){

    let l = -(can.width/2)/gameScaleX-world.x;
    world.x = -((can.width/2)/gameScaleX);
    inst.x+=l;
    inst.brain.movingX ="playerLeft";
  }
}
