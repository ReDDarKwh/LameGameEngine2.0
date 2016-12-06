
var Sprite = function(w,h,spd,angle,alpha){

  var counter = 0,sx=0, sy=0, ox = 0, oy = 0,  loop=1, reverse = 0;

  this.currentSprite = "";
  this.animList = {};
  this.width = w;
  this.height = h;
  this.ow = w;
  this.oh = h;
  this.currentFrame = -1;
  this.animSpeed=spd;
  this.spd = spd;

  this.angle = angle===undefined?0:angle;
  this.alpha = alpha===undefined?1:alpha;


  this.setSprite = function(name,refresh,keepFrame,reverseAnim){

    reverse = reverseAnim;

    if(this.currentSprite!=name || refresh){

      this.currentSprite = name;

      let cs = this.animList[this.currentSprite];

      this.animSpeed = cs.spd===undefined? this.spd: cs.spd;
      loop = cs.loop===undefined?1:cs.loop;

      this.width = cs.dimention===undefined? this.ow: cs.dimention.w;
      this.height = cs.dimention===undefined? this.oh: cs.dimention.h;

      ox = cs.ox === undefined? -this.width/2: -cs.ox;
      oy = cs.oy === undefined? -this.height/2: -cs.oy;

      if(!keepFrame)this.currentFrame = 0;
      counter=0;
      this.done = 0;
      sx = cs.anim[0]*this.width;

    }
  };

  this.done=0;

  this.update = function(dt){

    if(this.animList[this.currentSprite].anim.length>1 ){
    counter+=dt;

      if(counter>= this.animSpeed){

        if(loop){
        this.currentFrame = (this.currentFrame+1) % (this.animList[this.currentSprite].anim.length)
        }else{
          if(!this.done){

            if(this.currentFrame >= this.animList[this.currentSprite].anim.length-1){

              this.done = 1;
            }else{

              this.currentFrame++
            }

          }
        }

        let a =  this.animList[this.currentSprite].anim;
        if(reverse){
          sx = a[a.length-1-this.currentFrame]*this.width;
        }else{
          sx = a[this.currentFrame]*this.width;
        }

        counter = 0;
      }
    }
  };

  this.draw = function(x,y){

    if(isInRect(x,y,
      -can.width/2/gameScaleX,
      -can.height/2/gameScaleY,
      can.width/gameScaleX,
      can.height/gameScaleY)){

      ctx.save();

        ctx.globalAlpha = this.alpha;


          ctx.translate(x, y);
          ctx.rotate(this.angle);

          ctx.drawImage(this.animList[this.currentSprite].image,
          sx,sy,this.width,this.height,ox,oy,this.width,this.height);

      ctx.restore();


    }



    /*
      if(this.currentSprite === "lazerStart"){

         let hitBox = {up:[-7,0,14,-64],
              left:[0,-7,-64,14],
              down:[-7,0,14,64],
              right:[0,-7,64,14]};


         let drawRect = function(x,y,w,h){

         ctx.fillRect(x,y,w,h);

         }

        ctx.save();
        ctx.globalAlpha = 0.5;
          drawRect(x+hitBox.up[0],y+hitBox.up[1],hitBox.up[2],hitBox.up[3])
          drawRect(x+hitBox.down[0],y+hitBox.down[1],hitBox.down[2],hitBox.down[3])
          drawRect(x+hitBox.right[0],y+hitBox.right[1],hitBox.right[2],hitBox.right[3])
          drawRect(x+hitBox.left[0],y+hitBox.left[1],hitBox.left[2],hitBox.left[3])
        ctx.restore();


      }
    */

  }
};//sprite
