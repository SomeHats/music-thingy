function Echonest() {
    // Handing out an API key like this is probably bad practice...
    var key = 'YT7JRBVK9SDXVGYRO',
        callback;
    return {
        search: function(artist, title, cb) {
            var $script, url;
            console.log('echonest search');
            url = app.url('http://developer.echonest.com/api/v4/song/search', {
                api_key: key,
                format: 'jsonp',
                callback: 'echonest.results',
                artist: artist,
                title: title,
                results: 1,
                bucket: 'audio_summary'
            });
            
            // Load the stuff
            $script = $('<script type="text/javascript"></script>');
            $script.attr('src', url);
            $script.appendTo(document.head);
            
            // Load notice
            loadNotice.fix();
            loadNotice.show();
            loadNotice.hideProgress();
            
            // callback
            callback = cb;
        },
        
        results: function(data) {
            console.log('echonest results');
            var beatLength,
                tempo,
                tSig;
            if (data.response.songs && data.response.songs.length) {
                // yay! We have results!
                tempo = data.response.songs[0].audio_summary.tempo;
                tSig = data.response.songs[0].audio_summary.time_signature;
                if (tempo === 0) {
                    alert('Couldn\'t find song tempo.');
                }
                beatLength = 60 / tempo;
            } else {
                // Sadface. Couldn't find a matching song. Just guess the details
                alert('Couldn\'t find song tempo.');
                tSig = 4;
                beatLength = 0.5;
            }
            callback(beatLength, tSig);
        }
    }
}