App = require 'app'
Results = Backbone.Collection
Result = require 'models/result'
ResultView = require 'views/result'

module.exports = class ResultsView extends Backbone.View
  tagName: 'ul'
  id: 'results'

  initialize: ->
    _.bindAll @

    @term = @options.term
    @ready = true

    @searchYoutube()

    @collection = new Results model: Result

  destroy: ->
    if @req.done isnt true
      @req.req.abort()
     
    @remove()

  perPage: 10
  page: 0
  req:
    done: false
  toLoad: 0
  loaded: 0
  ready: false

  searchYoutube: ->
    if @ready
      App.loader.progress 0
      App.loader.show false
      @ready = false
      @req.req = jQuery.ajax
        url: 'https://gdata.youtube.com/feeds/api/videos',
        dataType: 'jsonp'
        context: @
        data: 
          alt: 'json-in-script'
          v: 2
          'start-index': 1 + (@page * @perPage)
          'max-results': @perPage
          q: @term
          category: 'Music'
        success: @youtubeResults
        error: @youtubeError

  youtubeError: ->
    App.error 'could not get Youtube results.'
    @trigger 'fail'

  youtubeResults: (data) ->
    if data and data.feed
      if data.feed.entry
        videos = data.feed.entry
        
        App.loader.show true

        for video in videos
          for thumb in video.media$group.media$thumbnail when thumb.yt$name is 'mqdefault'
            $thumb = $ '<img>'
            $thumb.attr
              alt: "Thumbnail: #{video.title.$t}"
              width: thumb.width
              height: thumb.height
              src: thumb.url
            video.thumb = thumb.url
            @toLoad += 1
            $thumb.on 'load', null, video, @addResult
      else
        # No more videos
        # Temporary:
        App.error 'no more video results'
        App.loader.hide()

    else @youtubeError()

  addResult: (e) ->
    @loaded += 1
    App.loader.progress(@toLoad / @loaded)
    if @loaded is @toLoad
      @toLoad = @loaded = 0
      @ready = true
      App.loader.hide()

    result = new Result raw:e.data
    result_view = new ResultView model: result
    @$el.append result_view.el
