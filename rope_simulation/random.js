var random = {

  r: function (n){

    return Math.random()*n;
  },


  round: function (n){

    return Math.round(this.r(n));
  },

  range: function (min,max){

   return Math.random()*(max-min)+min;
  },

  roundRange: function(min, max){

    return Math.round(this.range(min,max))
  }


}
