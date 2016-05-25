


var world = {
  
  
  x:-800,
  y:-400,
  width:null,
  height:null,
  data:null,
  background:null,
  tileSet:null,
  tileSetSize:0,
  tileSize:0,
  tileCoords:[],
  blockingTileCoords:{},
  colMap:[],
  
  init : function(data){
    
    this.data = data;
    this.background = new Image();
    this.background.src = this.data.background;
    this.tileSet = new Image();
    this.tileSet.src = this.data.tilesets[0].image;
    this.tileSetSize = this.data.tilesets[0].imagewidth/this.data.tilewidth;
    this.tileSize = this.data.tilewidth;
    this.width = this.data.width*this.tileSize;
    this.height = this.data.height*this.tileSize;
  
    this.data.layers.forEach(function(c){
     
     
     c.data.forEach(function(cc,i){
       
       var index = cc-1;
       
       if(index!==-1){
         
         var tileSetY = (Math.floor(index/this.tileSetSize)),
             tileSetX = (index-this.tileSetSize*tileSetY)*this.tileSize,
             mapY = (Math.floor(i/this.data.width)),
             mapX = (i - this.data.width*mapY)*this.tileSize;
         
         tileSetY*=this.tileSize;
         mapY*=this.tileSize;
         
         this.tileCoords.push({tX:tileSetX,tY:tileSetY,mX:mapX,mY:mapY,type:c.name});
         
       }
       
       
       
     }.bind(this));
   }.bind(this));
    
     
    //Path collision map initiation
    for(let y=0; y<this.data.height; y++){
      
      this.colMap.push([]);
      
      for(let x=0; x<this.data.width;x++){
        
        this.colMap[y].push(1);
        
      }
    }
    
    
    this.tileCoords
    .filter(function(c){return c.type!=="notBlocking" ;})
    .forEach(function(c){
        
      if(this.blockingTileCoords[c.type]){
          this.blockingTileCoords[c.type].push({mX:c.mX+this.tileSize/2,mY:c.mY+this.tileSize/2});
      }else{
          
          this.blockingTileCoords[c.type]=[{mX:c.mX+this.tileSize/2,mY:c.mY+this.tileSize/2}];
          
      }
    
      this.colMap[Math.floor(c.mY/this.tileSize)][Math.floor(c.mX/this.tileSize)]=0;
      
    
    }.bind(this));
    
  
    
    
  },
  
  
  col:{
    
    test: function(whatToCheck,type){
      if(!whatToCheck){return true}
      if(whatToCheck.some(function(c){return type===c})){return true}
      return false;
    },
    
    disTest: function(x,y,mX,mY){
     
      return getDistance(x,y,mX+world.x,mY+world.y)>20;
    },
      
  
    playerCheckCollisions : function(x,y,mx,my,vl,hl,whatToCheck){
    
      var colX=false,colY=false,
          left1 = x-vl,right1 = x+vl,
          bottom1 = y+hl,top1 = y-hl, l= world.tileSize/2;
  
    
    for(var type in world.blockingTileCoords){
      
      if (world.col.test(whatToCheck,type)){
          
        for(let i = 0; i< world.blockingTileCoords[type].length; i++){
      
          let c = world.blockingTileCoords[type][i];
          
          if(world.col.disTest(x,y,c.mX,c.mY))continue;
              
          let left2 = c.mX+world.x-l,
          right2 = c.mX+world.x+l,
          bottom2 = c.mY+world.y+l,
          top2 = c.mY+world.y-l;
          
          if(right1+mx> left2 && left1+mx< right2 &&
             bottom1> top2 && top1< bottom2)colX = true;
          
          if(right1> left2 && left1< right2 &&
             bottom1+my> top2 && top1+my< bottom2)colY = true;

          if(colX===true && colY===true){ break;}
        }
      
      }
    
    }
  
    
    
    return [colX,colY];
    },
  
    checkCollisions : function(x,y,vl,hl,whatToCheck){
      
      var left1 = x-vl,right1 = x+vl,
          bottom1 = y+hl,top1 = y-hl, l= world.tileSize/2;
          
     
      
      for(var type in world.blockingTileCoords){
        
        if (world.col.test(whatToCheck,type)){
            
          for(let i = 0; i< world.blockingTileCoords[type].length; i++){
        
            let c = world.blockingTileCoords[type][i];
            
            if(world.col.disTest(x,y,c.mX,c.mY))continue;
                
            let left2 = c.mX+world.x-l,
            right2 = c.mX+world.x+l,
            bottom2 = c.mY+world.y+l,
            top2 = c.mY+world.y-l;
            
            if(right1> left2 && left1< right2 &&
               bottom1> top2 && top1< bottom2)return true;
   
          }
        }
      }
    
      return false;
    }
    
  },
  
  draw : function(){
    
    ctx.drawImage(this.background,this.x,this.y);
    
    this.tileCoords.forEach(function(c){
      
      let x = c.mX+this.x+this.tileSize/2, y = c.mY+this.y+this.tileSize/2;
      
      if(isInRect(x,y,-can.width/2/gameScaleX-this.tileSize/2,
                 -can.height/2/gameScaleY-this.tileSize/2,
                  can.width/gameScaleX+this.tileSize,
                 can.height/gameScaleY+this.tileSize)){
      
        ctx.drawImage(this.tileSet,c.tX,c.tY,
                      this.tileSize,this.tileSize,
                      Math.round(c.mX+this.x),Math.round(c.mY+this.y),this.tileSize,this.tileSize);
     }
    }.bind(this));
  }
};