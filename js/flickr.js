var Flickr = function () {
    'use strict';
    
    var key = '9bc7e4422214850606dea003fa9993f6',
        query = '',
        isReset;
    
    return {
        search: function(q, n) {
            console.log('flickr search');
            var $script,
                url;
            
            query = q;
            
            url = app.url('http://api.flickr.com/services/rest/', {
                method: 'flickr.photos.search',
                api_key: key,
                format: 'json',
                jsoncallback: 'flickr.results',
                sort: 'relevance',
                per_page: n < 500 ? n : 500,
                text: query
            });
            
            $script = $('<script type="text/javascript"></script>');
            $script.attr('src', url);
            $script.appendTo(document.head);
        },
        
        results: function(data) {
            console.log('flickr results')
            if (data.stat === 'ok') {
                var total = data.photos.photo.length,
                    loaded = 0,
                    ths = this,
                    imgLoad,
                    imgError,
                    photo,
                    $photo,
                    i;
                
                imgLoad = function() {
                    var $this = $(this);
                    if ($this.data('query') === query) {
                        loaded += 1;
                        $('#flickrNotice').html(loaded + ' / ' + total);
                        if (this.height > this.width * 1.2) {
                            $this.css({
                                top: '0',
                                left: '50%',
                                position: 'absolute',
                                marginLeft: '-' + (this.width / 2) + 'px',
                                marginTop: '0px'
                            });
                        } else {
                            $this.css({
                                top: '50%',
                                left: '50%',
                                position: 'absolute',
                                marginLeft: '-' + (this.width / 2) + 'px',
                                marginTop: '-' + (this.height / 2) + 'px'
                            });
                        }
                        ths.photos.push($this);
                        if (loaded === total) {
                            loadNotice.hide();
                            ths.done();
                        }
                        if (ths.show) {
                            loadNotice.progress(loaded / total);
                        }
                    }
                }
                
                imgError = function() {
                    var $this = $(this);
                    if ($this.data('query') === query) {
                        total -= 1;
                        $('#flickrNotice').html(loaded + ' / ' + total);
                        if (loaded === total) {
                            loadNotice.hide();
                            ths.done();
                        }
                        if (ths.show) {
                            loadNotice.progress(loaded / total);
                        }
                    }
                }
                
                if (ths.show) {
                    loadNotice.showProgress();
                }
                
                for (i = 0; i < total; i++) {
                    photo = data.photos.photo[i];
                    $photo = $('<img alt="flickr">');
                    $photo.on('load', imgLoad)
                    $photo.on('error', imgError)
                    $photo.data('query', query);
                    $photo.attr('src', 'http://farm' + photo.farm + '.staticflickr.com/' + photo.server + 
                            '/' + photo.id + '_' + photo.secret + '.jpg');
                }
            } else {
                alert('Couldn\'t load Flickr photos :(');
            }
        },
        
        done: function() {
            console.log('flickr done');
            this.loaded = true;
            this.callback();
        },
        
        reset: function() {
            console.log('flickr reset');
            this.photos = [];
            this.loaded = false;
            query = '';
        },
        
        randomPhoto: function() {
            return this.photos[Math.floor(Math.random() * this.photos.length)].clone();
        },
        
        show: false,
        loaded: false,
        callback: function() {},
        
        photos: []
    }
};