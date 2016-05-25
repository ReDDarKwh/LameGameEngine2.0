
var Sprite = function(defaultAnimName,w,h,animSpeed,ox,oy,angle,alpha){
    
    var counter = 0,currentFrame = -1,animList = {},currentSprite=defaultAnimName;
    
  
  this.addSprite = function (name,dir,anim){
   
    animList[name] = {anim:anim,image: new Image()};
    animList[name].image.src = "./assets/sprites/"+dir;
  };
  
  
  this.sx = 0;
  this.sy = 0;
  this.angle = angle===undefined?0:angle;
  this.alpha = alpha===undefined?1:alpha;
  
  this.setSprite = function(name){
    
    if(currentSprite!=name){
      
      currentFrame = 1;
      currentSprite = name;
      counter=0;
      this.sx = animList[currentSprite].anim[currentFrame]*w;
    }
  };
  
  
  this.update = function(dt){
    
    counter+=dt;
    if(animList[currentSprite].anim.length>1 ){
      if(counter>= animSpeed*1000){
        
        currentFrame = (currentFrame+1) % (animList[currentSprite].anim.length);
        this.sx = animList[currentSprite].anim[currentFrame]*w;
        counter = 0;
      }
    }
  };
  
  this.draw = function(dx,dy){
    
    ctx.save();
    ctx.globalAlpha = this.alpha;
      if(isInRect(dx,dy,
                  -can.width/2/gameScaleX,
                  -can.height/2/gameScaleY,
                  can.width/gameScaleX,
                  can.height/gameScaleY)){
    
    
        ctx.translate(Math.round(dx), Math.round(dy));
        ctx.rotate(this.angle);
    
   
        ctx.drawImage(animList[currentSprite].image,
        this.sx,this.sy,
        w,h,
        0-(ox||0), 0-(oy||0),
        w,h);
    
      }
    
    ctx.restore();
  };
};//sprite