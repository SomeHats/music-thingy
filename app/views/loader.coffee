template = require 'views/templates/loader'

module.exports = class LoaderView extends Backbone.View
  tagName: 'div'

  initialize: ->
    _.bindAll @

    @progress = @model.get 'progress'

    @model.on 'change:show', @visibility
    @progress.on 'change:show', @progressVisibility
    @progress.on 'change:meter', @progressMeter

    @template = template

    @render()

  render: ->
    @$el.html @template()

    @$progressEl = @$el.find '#progress'
    @$meterEl = @$progressEl.find 'div'

    @visibility()
    @progressVisibility()
    @progressMeter()

    @

  visibility: ->
    if @model.get 'show'
      @$el.removeClass 'off'
    else
      @$el.addClass 'off'

  progressVisibility: ->
    if @progress.get 'show'
      @$progressEl.removeClass 'off'
    else
      @$progressEl.addClass 'off'

  progressMeter: ->
    @$meterEl.css 'width', @progress.get('meter') * 100 +'%'
