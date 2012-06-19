MusicThingy
===========
(that's a working title :P )

###[Give it a go!](http://somehats.github.com/music-thingy/) - http://somehats.github.com/music-thingy/
(A song with a really strong beat will work best!)

Music visualisation thingy with [Popcorn.js](http://popcornjs.org/), CSS 3D transforms, and a load of open data APIs.

This is very much a work-in-progress. I need to rewrite the entire song-selection bit with Backbone or Ember or something, and I need to fix the very hacky way that data is loaded from the various APIs.

The Plan:-
----------
* Choose an band or musician
* Search YouTube for music videos by that band or musician. Choose a video.
* Get some analysis of the track via the [Echonest API](http://the.echonest.com/).
* Get a load of Flickr photos, tweets and stuff relevant to the chosen song / artist.
* Put the photos and tweets and stuff on a sort of Rubik's cube, and 'solve' it in time to the music.

TODO:-
------
* Rewrite most of this with [Backbone.js](http://backbonejs.org/) or [Ember.js](http://emberjs.com/)
* Image sizing / positioning
* Fetch & display tweets
* Fetch and display lyrics?
* Use the full echonest analysis to change how fast the cube does it's funky thang at different points in the song.