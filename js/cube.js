function Cube() {
    'use strict';
    
    var $cube = $('#cube'),
        $window = $(window),
        $video = $('#video'),
        geom = {
            elements: [$('#top'), $('#bottom'), $('#left'), $('#right')],
            rotation: [0, 0, 0, 0],
            translation: [0, 0, 0, 0],
            affects: [[[2, 1], null, [3, 1]],
                      [[2, 3], null, [3, 3]],
                      [[0, 1], null, [1, 1]],
                      [[0, 3], null, [1, 3]]]
        },
        trans = Modernizr.prefixed('transform'),
        duration = 0,
        photos = [],
        video;
    
    return {
        video: {},
        beatLength: 0.5,
        timeSignature: 4,
        artist: '',
        
        init: function(artist, bl, tsig) {
            console.log('cube init');
            this.beatLength = bl;
            this.timeSignature = tsig;
            this.artist = artist;
            
            flickr.show = true;
            $cube.css('display', 'block');
            
            video = this.video;
            
            video.cue(0, function() {
                if (duration === 0) {
                    video.mute();
                }
            });
            video.cue(0.1, function() {
                if (duration === 0) {
                    console.log('video duration set');
                    duration = video.duration();
                    video.pause();
                    video.unmute();
                    video.currentTime(0);
                    
                    cube.load();
                }
            });
            
            video.mute();
            video.play();
        },
        
        load: function() {
            console.log('cube load');
            if (!flickr.loaded) {
                var ths = this;
                flickr.callback = function() {ths.sequence()};
            } else {
                this.sequence();
            }
        },
        
        sequence: function() {
            console.log('cube sequence');
            var rotate = this.rotate,
                n = 0,
                i;
            $('#geom > div').css(Modernizr.prefixed('transition') + 'Duration', this.beatLength + 's');
            for (i = this.beatLength; i < duration - this.beatLength; i += this.beatLength) {
                video.cue(i, function() {
                    n += 1;
                    if (n % settings.speed === 0) {
                        var side;
                        
                        loadNotice.hide();
                        
                        if (Math.random() < 0.75) {
                            // Rotate 1;
                            side = Math.floor(Math.random() * 4)
                            side = side === 4 ? 3 : side;
                            rotate(side);
                        } else if (Math.random() < 0.5) {
                            // Rotate 2: vertical
                            rotate(0);
                            rotate(1);
                        } else {
                         // Rotate 2: horizontal
                            rotate(2);
                            rotate(3);
                        }
                    }
                });
            }
            
            video.cue(duration - this.beatLength, function() {cube.hide()});
            
            for (i = 0; i < 4; i += 1)  {
                this.fill(i, 0);
            }
            
            this.start();
        },
        
        fill: function(side, direction) {
            var photos = [flickr.randomPhoto(), flickr.randomPhoto(), flickr.randomPhoto()],
                target = 'current',
                i, x, y;
            
            if (direction !== 0) {
                target = direction === 1 ? 'previous' : 'next';
            }
            
            for (i = 0; i < 3; i += 1) {
                //console.log('----------------------------------------');
                x = geom.elements[side];
                //console.log(x);
                y = '.'+target + ' .p' + (i + 1);
                //console.log(y);
                x = x.find(y);
                //console.log(x);
                x = x.empty();
                //console.log(x);
                photos[i].appendTo(x);
                if (geom.affects[side][i] !== null) {
                    x = geom.elements[geom.affects[side][i][0]];
                    y = '.current .p' + geom.affects[side][i][1];
                    x = x.find(y);
                    x = x.empty();
                    photos[i].clone().appendTo(x);
                }
            }
        },
        
        rotate: function(side) {
            var v =  Math.random() < 0.5 ? 1 : -1,
                xy = (side > 1),
                current = geom.elements[side].find('.current'),
                next = geom.elements[side].find('.next'),
                previous = geom.elements[side].find('.previous'),
                rear = geom.elements[side].find('.rear'),
                i;
            
            for(i = 0; i < 3; i += 1) {
                //video.pause();
                if (geom.affects[side][i] !== null) {
                    geom.elements[geom.affects[side][i][0]].find('.p' + geom.affects[side][i][1]).css('display', 'none');
                }
            } 
            
            cube.fill(side, v);
            
            if (v === -1) {
                current.removeClass('current').addClass('previous');
                next.removeClass('next').addClass('current');
                previous.removeClass('previous').addClass('rear');
                rear.removeClass('rear').addClass('next');
            } else {
                current.removeClass('current').addClass('next');
                next.removeClass('next').addClass('rear');
                previous.removeClass('previous').addClass('current');
                rear.removeClass('rear').addClass('previous');
            }
            
            geom.elements[side].find('.panel').css('display', 'block');
            
            geom.rotation[side] += v;
            geom.elements[side].css(trans,
                    'translateZ(-' + (geom[xy ? 'height' : 'width'] / 2) + 'px) rotate' + 
                    (xy ? 'X' : 'Y') + '(' + (geom.rotation[side] * 90) + 'deg)');
        },
        
        show: function() {
            console.log('cube show');
            $(document.body).css('overflow', 'hidden');
            $window.on('resize', this.render);
            setTimeout(function(){$cube.addClass('animate');}, 10);
            $video = $('#video, #video > *');
            this.render();
        },
        
        hide: function() {
            console.log('cube hide');
            $(document.body).css('overflow', 'hidden');
            $window.off('resize');
            $cube.removeClass('animate');
            app.view1();
        },
        
        render: function() {
            var width = $window.width(),
                height = $window.height(),
                vh = width * 0.225,
                vw = width / 2.5,
                space = {
                    x: (width - vw) / 2,
                    y: (height - vh) / 2
                },
                rotation = [0, 90, 180, -90],
                vsides = ['front', 'bottom', 'back', 'top'],
                hsides = ['front', 'right', 'back', 'left'],
                i; 
            
            $video.width(vw);
            $video.height(vh);
            
            $video.css({
                top: space.y,
                left: space.x
            });
            
            geom.elements[0].css({
                top: 0,
                left: 0,
            }).css(trans, 'translateZ(-' + (width/2) + 'px) rotateY(' + (geom.rotation[0] * 90) + 'deg)');
            geom.elements[1].css({
                top: space.y + vh,
                left: 0,
            }).css(trans, 'translateZ(-' + (width/2) + 'px) rotateY(' + (geom.rotation[1] * 90) + 'deg)');
            geom.elements[2].css({
                top: 0,
                left: 0
            }).css(trans, 'translateZ(-' + (height/2) + 'px) rotateX(' + (geom.rotation[2] * 90) + 'deg)');
            geom.elements[3].css({
                top: 0,
                left: space.x + vw
            }).css(trans, 'translateZ(-' + (height/2) + 'px) rotateX(' + (geom.rotation[3] * 90) + 'deg)');
            
            $('#top .face, #bottom .face').css({
                width: width,
                height: space.y
            });
            $('#left .face, #right .face').css({
                width: space.x,
                height: height
            });
            
            geom.width = width;
            geom.height = height;
            
            for(var i = 0; i < 4; i += 1) {
                $('#top .' + hsides[i] + ', #bottom .' + hsides[i]).css(
                        trans,
                        'rotateY(' + rotation[i] + 'deg) translateZ(' + (width / 2) + 'px)');
            }
            
            for(var i = 0; i < 4; i += 1) {
                $('#left .' + vsides[i] + ', #right .' + vsides[i]).css(
                        trans,
                        'rotateX(' + rotation[i] + 'deg) translateZ(' + (height / 2) + 'px)');
            }
            
            $('#top .p1, #bottom .p1').css({
                width: space.x
            })
            $('#top .p2, #bottom .p2').css({
                width: vw,
                left: space.x
            });
            $('#top .p3, #bottom .p3').css({
                width: space.x,
                left: space.x + vw
            });
            
            $('#left .p1, #right .p1').css({
                height: space.y
            })
            $('#left .p2, #right .p2').css({
                height: vh,
                top: space.y
            });
            $('#left .p3, #right .p3').css({
                height: space.y,
                top: space.y + vh
            });
        }, 
        
        start: function() {
            console.log('cube start');
            this.show();
            loadNotice.hide();
            video.play();
        }
        
    }
}