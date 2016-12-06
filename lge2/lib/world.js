


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
    this.tileSetSize = this.data.tilesets[0].imagewidth/this.data.tilewidth;
    this.tileSize = this.data.tilewidth;
    this.width = this.data.width*this.tileSize;
    this.height = this.data.height*this.tileSize;
    this.blockingTileCoords.blocking = [];
    this.blockingTileCoords.trees = [];

    this.data.layers.forEach(function(c){

      switch(c.type){

        case "tiles":
          c.data.forEach(function(cc,i){

            var index = cc-1;

            if(index!==-1){

              var tileSetX = (index % this.tileSetSize)*this.tileSize,
              tileSetY = (Math.floor(index/this.tileSetSize))*this.tileSize,

              mapX = (i % this.data.width)*this.tileSize,
              mapY = (Math.floor(i/this.data.width))*this.tileSize;

              this.tileCoords.push({tX:tileSetX,tY:tileSetY,mX:mapX,mY:mapY,type:c.name});
            }

          }.bind(this));
        break;
        case "objects":
          objects.addType(c.name,[{name:c.name,path:c.path,anim:"0",oy:c.oy}]);

          c.objects.forEach(function(o){

            objects.addInstance({x:o.x,y:o.y,spr:new Sprite(c.width,c.height),type:c.name,defAnim:c.name});

            if(c.name === "tree"){

              this.blockingTileCoords.trees.push({mX:o.x-8,mY:o.y-8,type:"trees"});
            }

          }.bind(this));
        break;
        case "paths":

          paths[c.name]={};

          c.objects.forEach(function(p){

            paths[c.name][p.name]=p.polyline.map(coords=>[p.x+coords.x,p.y+coords.y]);

          });

        break;

      }

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

      if(!this.blockingTileCoords[c.type])this.blockingTileCoords[c.type]=[]

      let tile = {mX:c.mX,mY:c.mY,type:c.type};
      this.blockingTileCoords[c.type].push(tile);


    }.bind(this));


    for(let type in this.blockingTileCoords){

      for(let i = 0; i<this.blockingTileCoords[type].length;i++){

        let c = this.blockingTileCoords[type][i];

        this.colMap[Math.floor(c.mY/this.tileSize)][Math.floor(c.mX/this.tileSize)]=0;
      }
    }




  },


  col:{


    disTest: function(x,y,mX,mY){

      return getDistance(x,y,mX+world.x,mY+world.y)>20;
    },

    loop: function(callback,whatToCheck,x,y,w,h){

      let loopBreak = false;


      for(var type in world.blockingTileCoords){

         if(loopBreak)break;

         if(whatToCheck){
           if(!whatToCheck.includes(type)) continue;
         }

        for(let i = 0; i< world.blockingTileCoords[type].length; i++){

          loopBreak = callback(world.blockingTileCoords[type][i]);
          if(loopBreak)break;
        }
      }
    },


    playerCheckCollisions : function(x,y,mx,my,w,h){

      let colX=false,colY=false,
          left1 = w>=0? x: x + w,
          right1 = w>=0? x + w: x,
          top1 = h>=0? y: y + h,
          bottom1 = h>=0? y + h: y, l= world.tileSize;



      world.col.loop(function(c){

        let left2 = c.mX,
            right2 = c.mX+l,
            bottom2 = c.mY+l,
            top2 = c.mY;


        if(right1+mx> left2 && left1+mx< right2 &&
           bottom1> top2 && top1< bottom2)colX = true;

        if(right1> left2 && left1< right2 &&
           bottom1+my> top2 && top1+my< bottom2)colY = true;



        if(colX && colY)return true;


      },0,x-1,y-1,w+2,h+2)


      return [colX,colY];
    },

    checkCollisions : function(x,y,w,h){

      let left1 = w>=0? x: x + w,
          right1 = w>=0? x + w: x,
          top1 = h>=0? y: y + h,
          bottom1 = h>=0? y + h: y, l= world.tileSize,col = false;

      world.col.loop(function(c){

        let left2 = c.mX,
        right2 = c.mX+l,
        bottom2 = c.mY+l,
        top2 = c.mY;

        if(right1> left2 && left1< right2 &&
        bottom1> top2 && top1< bottom2){
          col = true;
          return true;
        }

      },0,x-1,y-1,w+2,h+2);

      return col;
    }

  },

  draw : function(){


    ctx.drawImage(this.background,this.x,this.y);
    /*
    this.tileCoords.forEach(function(c){

      let x = c.mX+this.x+this.tileSize/2, y = c.mY+this.y+this.tileSize/2;

      if(isInRect(x,y,-can.width/2/gameScaleX-this.tileSize/2,
                 -can.height/2/gameScaleY-this.tileSize/2,
                  can.width/gameScaleX+this.tileSize,
                 can.height/gameScaleY+this.tileSize)){

        ctx.drawImage(this.tileSet,c.tX,c.tY,
                      this.tileSize,this.tileSize,
                      c.mX+this.x,c.mY+this.y,this.tileSize,this.tileSize);
     }
    }.bind(this));
    */
  }
};
