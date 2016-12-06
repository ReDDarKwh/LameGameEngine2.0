
var key = {


  pressed: {},
  mousedown:0,
  mouseX : 0,
  mouseY : 0,

  canMouseX : 0,
  canMouseY : 0,

  fourDir:{up:[0,-1],left:[-1,0],down:[0,1],right:[1,0]},

  canZoom:true,

  lastkey:[],

  down: function(e){


      this.pressed[e.code]=true;

      if(e.code=="KeyW" || e.code=="KeyA" || e.code=="KeyS" || e.code=="KeyD" ){
        if(!this.lastkey.includes(e.code))this.lastkey.unshift(e.code);
      }

  },

  up: function(e){

      this.pressed[e.code]=false;

      if(e.code=="KeyW" || e.code=="KeyA" || e.code=="KeyS" || e.code=="KeyD" ){
      this.lastkey.splice(this.lastkey.indexOf(e.code),1);
      }
  }

};




window.addEventListener('keydown', function(event) {


  key.down(event);


  switch(true){
    
    case event.code === "KeyB":
      objects.addInstance({x:key.mouseX,y:key.mouseY,spr:new Sprite(16,16),type:"effect",name:"bunnyDeath",defAnim:"bunnyBit0"})
      objects.addInstance({x:key.mouseX,y:key.mouseY,spr:new Sprite(16,16),type:"effect",name:"bunnyDeath",defAnim:"bunnyBit1"})
      objects.addInstance({x:key.mouseX,y:key.mouseY,spr:new Sprite(16,16),type:"effect",name:"bunnyDeath",defAnim:"bunnyBit2"})
      objects.addInstance({x:key.mouseX,y:key.mouseY,spr:new Sprite(16,16),type:"effect",name:"bunnyDeath",defAnim:"bunnyBit3"})
      
    break;
    case event.code === "KeyL":
      objects.lazer(-world.x,-world.y-1,prompt())
    break;
    
    case event.code === "KeyT":
      objects.player.changeType("player",32,32,"idleRight")
    break;
    case event.code === "KeyY":
      objects.player.changeType("slime",32,32,"idle")
    break;
    case event.code === "KeyU":
      objects.player.changeType("archer",32,32,"idleRight")
    break;
    case event.code === "KeyI":
      objects.player.changeType("robot",64,64,"idleRight")
    break;
    case event.code === "KeyO":
      objects.player.changeType("bunny",16,16,"idleRight")
    break;
    case event.code === "KeyP":
      objects.player.changeType("tree",80,80,"tree")
    break;

    case event.code === "Digit9":
      objects.addInstance({x:key.mouseX,y:key.mouseY,spr:new Sprite(32,32,0.15,0,0),type:"slime",defAnim:"right"});
    break;
    case event.code === "Digit8":
      objects.addInstance({x:key.mouseX,y:key.mouseY,spr:new Sprite(16,16,0.07),type:"bunny",defAnim:"idleRight"});
    break;
    case event.code === "Digit7":
      objects.addInstance({x:key.mouseX,y:key.mouseY,spr:new Sprite(32,32,0.07),type:"archer",defAnim:"idleRight"});
    break;

    case event.code === "Equal" && key.canZoom:
       changeScale(1);
       key.canZoom=false;
    break;
    case event.code === "Minus" && key.canZoom:
      changeScale(-1);
      key.canZoom=false;
    break;
    case event.code === "KeyF":
      if(document.webkitFullscreenElement){

      document.webkitExitFullscreen();

      }else{

      can.webkitRequestFullscreen();

      }
    break;
    case event.code === "Space":
      event.preventDefault();
    break;

  }





}, false);


window.addEventListener('keyup', function(event) {

  key.up(event);


  if(!key.pressed["Minus"] && !key.pressed["Equal"]){
    key.canZoom=true;
  }


}, false);


uican.addEventListener('mousemove', function(event) {

 key.mouseX = (event.offsetX-can.width/2)/gameScaleX-world.x;
 key.mouseY = (event.offsetY-can.height/2)/gameScaleY-world.y;
 key.canMouseX = event.offsetX;
 key.canMouseY = event.offsetY;


}, false);


document.addEventListener("mousemove",function(event){
   cursor.style.left = event.pageX-11+"px";
   cursor.style.top = event.pageY-5+"px";
})



window.addEventListener('mousedown', function(event) {

key.mousedown = 1;
if(key.pressed.KeyC)console.log(Math.floor((key.mouseX)/16),Math.floor((key.mouseY)/16));


}, false);

window.addEventListener('mouseup', function(event) {
 key.mousedown = 0;

}, false);
