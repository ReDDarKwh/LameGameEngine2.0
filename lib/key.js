    
var key = {
  pressed: [],
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  E: 69,
  SPACE:32,
  ALT:18,
  MINUS:189,
  PLUS:187,
  
  mousedown:0,
  mouseX : 0,
  mouseY : 0,
  
  
  canZoom:1,
  
  lastkey:[],

  down: function(e){
    
    
      this.pressed[e.keyCode]=true;
      
      if(e.keyCode==this.W || e.keyCode==this.A || e.keyCode==this.S || e.keyCode==this.D ){
        if(!this.lastkey.includes(e.keyCode))this.lastkey.unshift(e.keyCode);
      }
    
  },
  
  up: function(e){
      this.pressed[e.keyCode]=false;
      
      if(e.keyCode==this.W || e.keyCode==this.A || e.keyCode==this.S || e.keyCode==this.D ){
      this.lastkey.splice(this.lastkey.indexOf(e.keyCode),1);
      }
  }

};



 
window.addEventListener('keydown', function(event) {
  
  
  key.down(event);

  if(event.keyCode === key.E){
    
    objects.addInstance(key.mouseX-world.x,key.mouseY-world.y,new Sprite("left",32,32,0.15,16,16,0,0),"enemy",80,{dir:-1});
    
  }
  
  if(event.keyCode === key.PLUS && key.canZoom){
    
    changeScale(1);
    key.canZoom=0;
  }
  
  if(event.keyCode === key.MINUS && key.canZoom){
    
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