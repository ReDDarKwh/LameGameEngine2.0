window.onload = function(){

var input = document.getElementById("input"),
    button = document.getElementById("button");

input.onkeypress = function(e){

	if(e.code === "Enter"){
		getCat();
	}
}

cats = {
	apocalypse:'https://architecturalafterlife.files.wordpress.com/2014/03/cat-apocalypse2num5.jpg',
	melting:'https://s-media-cache-ak0.pinimg.com/564x/cf/95/0f/cf950f6973c3e52ecf9548e210b58bf8.jpg',
	flying:'http://vignette1.wikia.nocookie.net/yogscast/images/3/39/Flying_cat_balls.gif/revision/latest?cb=20121112102158',
	fat:'https://i.ytimg.com/vi/IaVIRqHBM3k/hqdefault.jpg',
	robot:'https://d13yacurqjgara.cloudfront.net/users/107759/screenshots/1035075/cat.png',
	high:'https://i.ytimg.com/vi/OxgKvRvNd5o/maxresdefault.jpg',
	deadly:'http://1.bp.blogspot.com/-pSk1AHMXTic/T5P9HrlLVHI/AAAAAAAHgtE/wn_nXPtfB7k/s1600/funny+cats+photos,crazy+cat+photos.gif',
	horny:'http://www.metro-pets.com/uploads/4/2/1/2/42124291/1458559047.png',
	tasty:'http://img03.deviantart.net/c871/i/2010/130/a/f/candy_cat_by_yami_okami_yasha.png',
	happy:'https://i.imgflip.com/cnudu.jpg',
	programmer:'http://s2.quickmeme.com/img/04/04d35f673da492837167862bfb79e7dbbc92f91a05683ebc2a4a101c7afe93d2.jpg',
	fluffy:'http://static.boredpanda.com/blog/wp-content/uploads/2016/03/hairy-fluffy-cat-sky-the-ragdoll-31.jpg',
	space:'http://i.imgur.com/kQJTRzf.jpg',
	snake:'http://i.imgur.com/hsZojsf.jpg',
	strong:'https://s-media-cache-ak0.pinimg.com/736x/5b/af/e8/5bafe80704c8c14100bd6e3d99ac5bc7.jpg',
	badass:'http://ih0.redbubble.net/image.67343561.5074/flat,1000x1000,075,f.jpg',
	lazer:'http://i266.photobucket.com/albums/ii255/Da_moopintot/LaserCatsSmall.jpg',
	scared:'https://media.giphy.com/media/4nUjFdHFdHQiY/giphy.gif',
	telekinesis:'https://lh3.googleusercontent.com/proxy/AywolWXyNdWCK7ONrj3Rnw8WOoplFRKT5WJxAhkyYc1hj7nKedbD-DiZyLHEBwJdX0zyp1066RqoIMnuq6UqcBpmioaEAmJHkutcZ4_uEopYeA=w426-h239-p',
	slinky:'http://media4.giphy.com/media/rpnJbg75fxa3m/giphy.gif',
	please:'http://ift.tt/2cUfaHf',
	massage:'http://www.cutecatgifs.com/wp-content/uploads/2016/06/cmas.gif',
	skate:'http://giphy.com/gifs/b4dj5rwNtHrEc?utm_source=iframe&utm_medium=embed&utm_campaign=tag_click',
	hitler:'http://thenextthirtyyears.com/wp-content/uploads/2015/01/Hitler-Cat.jpg',
	sexy:'https://s-media-cache-ak0.pinimg.com/564x/1a/9a/73/1a9a735ee004a48855f03f19c6f6e4a8.jpg',
	drowning:'http://i.imgur.com/QozOtZc.gif',
	dancing:'http://vignette2.wikia.nocookie.net/glee/images/1/1e/Cute_cat_gif_2_by_nataschamyeditions-d3d7mzb.gif/revision/latest?cb=20130718111030',
	box:'http://www.reactiongifs.com/r/2011/05/cat_in_a_box.gif',
	anime:'https://media.giphy.com/media/lkOtxEdbuNORG/giphy.gif',
	mlem:'http://i.imgur.com/dt04mTs.gif',
	tongue:'http://i4.mirror.co.uk/incoming/article5830759.ece/ALTERNATES/s1227b/PAY-A-cat-with-an-unusually-long-tongue.jpg',
	derp:'https://metrouk2.files.wordpress.com/2015/10/mr-magoo-the-cat-that-cant-stop-sticking-his-tongue-out-21.png',
	badtrip:'https://secure.static.tumblr.com/e10d9df5dfc1d4ac0c844c0e3cd5f17f/a72ml99/LtSo2pfim/tumblr_static_tumblr_static_c1sl5elocrkg4kccc0s4k4gkc_640.jpg',
	cute:"http://i.imgur.com/wp1jEBo.gifv",
	ugly:"http://www.memycatandi.com/wp-content/uploads/sites/994/2015/06/cat-ugly-faces-720x3501-720x350.jpg",
	cthulhu:"https://themonthlyspew.files.wordpress.com/2015/05/cthulhu_kitty.jpg"
}

keys = [];
for(var k in cats) keys.push(k);
document.getElementById("catList").innerHTML = keys.join(", \n")

 getCat = function(){
  	if(cats[input.value])window.open(cats[input.value]);
 }
}
