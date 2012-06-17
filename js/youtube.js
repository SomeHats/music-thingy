function Youtube() {
    'use strict';

    var perPage = 10;

    return {
        resultsExist: false,
        loading: false,
        limitReached: false,
        query: '',
        page: 0,

        search: function (q, start) {
            var $script, url;

            // Set public stuff
            this.query = q;
            this.page = start;
            this.loading = true;

            // Show the load notice
            if (!this.resultsExist) {
                loadNotice.moveTo('#v1');
            }
            loadNotice.show();

            // Youtube API URL
            url = app.url('https://gdata.youtube.com/feeds/api/videos', {
                'alt': 'json-in-script',
                'callback': 'youtube.results',
                'v': 2,
                'start-index': 1 + (start * perPage),
                'max-results': perPage,
                'q': q,
                'category': 'Music'
            });

            // Load the URL via a script tag
            $script = $('<script type="text/javascript"></script>');
            $script.attr('src', url);
            $script.appendTo(document.head);
        },

        results: function (data) {
            var $results = this.resultsExist ? $('#searchResults') : $('<ul id="searchResults"></ul>'),
                videos,
                l,
                loadImg,
                loadedImages,
                i,
                j,
                video,
                $item,
                $entry,
                $thumb,
                $title,
                $details,
                info;

            if (!data.feed.entry) {
                // We've run out of videos
                $('<li class="on"><h2 style="text-align:center">There aren\'t any videos :(</h2></li>').appendTo($results);
                if (!this.resultsExist) {
                    $results.appendTo('#v2');
                }
                this.limitReached = true;
                loadNotice.hide();
            } else {
                videos = data.feed.entry;
                l = videos.length;
                loadedImages = 0;

                // Called each time a thumbnail finished loading
                loadImg = function () {
                    loadedImages += 1;

                    loadNotice.progress(loadedImages / l);
                    if (loadedImages === l) {
                        // All the images have loaded

                        // Add search results to the document
                        if (!this.resultsExist) {
                            $results.appendTo('#v2');
                        }

                        loadNotice.progress(1);
                        loadNotice.hide();

                        youtube.resultsExist = true;
                        youtube.loading = false;

                        // Give time so that transitions work
                        setTimeout(function () {
                            // Show the results
                            $results.children().addClass('on');

                            // Check to see if we need to load more results
                            $(window).trigger('scroll');

                            // Reset the load notice
                            loadNotice.moveTo($results);
                            loadNotice.progress(0);
                            loadNotice.show();
                        }, 100);
                    }
                };

                // Show the load notice
                loadNotice.showProgress();
                loadNotice.progress(0);

                // For each result...
                for (i = 0; i < l; i += 1) {
                    video = videos[i];
                    // Create a list item
                    $item = $('<li></li>');
                    // Create a container (for vertical-align)
                    $entry = $('<div></div>');

                    // Create a thumbnail image
                    $thumb = $('<img alt="thumbnail">');

                    // For each thumbnail...
                    for (j = 0; j < video.media$group.media$thumbnail.length; j += 1) {
                        // Find the medium sized one...
                        if (video.media$group.media$thumbnail[j].yt$name === "mqdefault") {
                            // Set the thumbnail image attributes
                            $thumb.attr('src', video.media$group.media$thumbnail[j].url);
                            $thumb.attr('width', video.media$group.media$thumbnail[j].width);
                            $thumb.attr('height', video.media$group.media$thumbnail[j].height);

                            // Set the height of the entry according to thumbnail height
                            $item.height(video.media$group.media$thumbnail[j].height);
                            break;
                        }
                    }

                    // Ensure the image is laoded before it is shown
                    $thumb.on('load', loadImg);

                    // Add the image to the entry
                    $thumb.appendTo($item);

                    // Add the video title to the entry
                    $title = $('<h2></h2>');
                    $title.text(video.title.$t);
                    $title.appendTo($entry);
                    
                    // Store the video URL in the entry
                    $item.data('url', video.content ? video.content.src : video.link[0].href)

                    // Add uploader info to the entry
                    // TODO: Add 'watch on youtube' option
                    $details = $('<span class="details"></span>');
                    info = 'Uploaded By <a href="https://www.youtube.com/';
                    info += video.author[0].name.$t;
                    info += '">' + video.author[0].name.$t + '</a><br>';
                    $details.html(info);
                    $details.appendTo($entry);

                    // Add the entry to the list item
                    $entry.appendTo($item);

                    // Set transition-delay so search results enter in a slightly pretentious manner 
                    $item.css(Modernizr.prefixed('transition') + 'Delay', (i / 10) + 's' + ', 0s');

                    // Select a video
                    $item.on('click', {title: video.title.$t}, app.choose);

                    // Add the list item to the UL
                    $item.appendTo($results);
                }
            }
        }
    };
}