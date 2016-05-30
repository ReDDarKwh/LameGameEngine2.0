(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('sw-toolbox/sw-toolbox.js');
  
  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
  
  
   toolbox.precache(['./lib/astar.js',"./lib/game.js","./lib/stats.min.js",
                     "./lib/key.js","./lib/sprite.js","./lib/objects.js",
                     "./lib/world1data.js","./lib/world.js","main.js"]);
  
  
})(self);