function App() {
    'use strict';

        // view 1 container
    var $v1 = $('#v1'),
        // Overall container
        $container = $('#container'),
        // Go button
        $go = $('#go'),
        // Cancel button
        $cancel = $('#cancel'),
        // Artist input
        $artist = $('#artist'),
        // "play some" label
        $label = $('#v1 .label'),
        // Title
        $title = $('h1');

    return {
        // Current view
        page: 1,

        // Show view 1
        view1: function () {
            console.log('view1');
            if (this.page === 2) {
                $container.removeClass('view2');
                $container.addClass('view1');
                
                // Show the label
                $label.removeClass('animate').width($label.data('width'));
                
                // Contract artist box
                $artist.width($artist.data('width'));
                
                // Re-enable input
                $artist.removeAttr('readonly');
                $artist.off('focus');
                
                this.page = 1;
                
                // reset youtube search
                $('#searchResults').remove();
                youtube = new Youtube();
                
                // Clear flickr results
                flickr.reset();
                
                // Reset cube
                cube = new Cube();
            }
        },

        // Show view 2
        view2: function () {
            if ($v1.hasClass('ok')) {
                $container.addClass('view2');
                $container.removeClass('view1');
                
                console.log('view2');

                // Hide the label
                $label.data('width', $label.width());
                $label.addClass('animate').width('0px');

                // Expand artist box
                $artist.data('width', $artist.width());
                $artist.width($title.children().width());

                // Disable input
                $artist.attr('readonly', 'readonly');
                $artist[0].blur();
                $artist.on('focus', function () { this.blur(); });

                this.page = 2;

                // Start youtube search
                youtube.search($artist[0].value, 0);
                
                // Get flickr images
                flickr.search($artist[0].value, 250);
            }
        },

        // Cancel search
        cancel: function () {
            if ($v1.hasClass('ok') || $container.hasClass('view2')) {
                console.log('cancel')
                // Go to search-input, hiding search results
                if (this.page === 2) {
                    this.view1();
                }

                // Clear box
                $artist[0].value = '';
                $artist[0].focus();
            }
        },
        
        // Select a video
        choose: function (e) {
            if (!e.target.href) {
                console.log('choose');
                // It's not the link
                
                var title = e.data.title,
                    artist = youtube.query,
                    $item = $(this);
                e.preventDefault();
                
                // Get the song title out of youtube title
                title = title.toLowerCase();
                title = removeDiacritics(title);
                title = title.replace(artist.toLowerCase(), '');
                title = title.replace(/[\(\[{][^\)\]}]*[\)\]}]/gi, '');
                title = title.replace(/[^A-Za-z1-9\s]/gi, '');
                title = title.trim();
                
                // Create the popcorn instance for the video. Store it in the cube.
                cube.video = Popcorn.youtube('#video', $item.data('url') + '&controls=0');
                
                // Get track info, if possible...
                echonest.search(artist, title, function(bl, ts) {
                    // When done, load the cube
                    console.log('echonest done');
                    cube.init(artist, bl, ts);
                });
                
                // Hide other videos;
                $item.addClass('chosen');
                $('#searchResults').children(':not(.chosen)').removeClass('on');
                setTimeout(function() {
                    var transEndEventNames = {
                            'WebkitTransition' : 'webkitTransitionEnd',
                            'MozTransition'    : 'transitionend',
                            'OTransition'      : 'oTransitionEnd',
                            'msTransition'     : 'MSTransitionEnd',
                            'transition'       : 'transitionend'
                        },
                        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')];
                    
                    $('#container').on(transEndEventName, function() {
                        $(this).css('display', 'none');
                    }).removeClass('animate');
                }, 500);
                
                youtube.limitReached = true;
            }
        },
        
        url: function(url, data) {
            var key;
            
            if (url.indexOf('?') === -1) {url += '?';}
            
            for (key in data) {
                url += '&' + key + '=' + encodeURI(data[key]);
            }
            
            return url;
        }
    };
}