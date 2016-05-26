    
var key = {
  
  
  pressed: {},
  mousedown:0,
  mouseX : 0,
  mouseY : 0,
  
  
  canZoom:1,
  
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

  if(event.code === "KeyE"){
    
    objects.addInstance(key.mouseX-world.x,key.mouseY-world.y,new Sprite("right",32,32,0.15,16,16),"enemy",20);
    
  }
  
  if(event.code === "Equal" && key.canZoom){
    
    changeScale(1);
    key.canZoom=0;
  }
  
  if(event.keyCode === "Minus" && key.canZoom){
    
    changeScale(-1);
    key.canZoom=0;
  }
  
  
  
  
}, false);


window.addEventListener('keyup', function(event) {
  
  key.up(event);
  
  
  if(!key.pressed[key.MINUS] && !key.pressed[key.PLUS]){
    key.canZoom=1;
  }
  
  
}, false);

can.addEventListener("mousewheel",function(e){

  if(e.wheelDelta<0){changeScale(-1)}else{changeScale(1)}

});

can.addEventListener('mousemove', function(event) {
 
 key.mouseX = (event.offsetX-can.width/2)/gameScaleX;
 key.mouseY = (event.offsetY-can.height/2)/gameScaleY;

}, false);


window.addEventListener('mousedown', function(event) {
 
 key.mousedown = 1;
 
 console.log(Math.floor((key.mouseX-world.x)/16),Math.floor((key.mouseY-world.y)/16));
 
}, false);

window.addEventListener('mouseup', function(event) {
 key.mousedown = 0;

}, false);