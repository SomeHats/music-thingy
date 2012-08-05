template = require 'views/templates/result'

module.exports = class ResultView extends Backbone.View
  tagName: 'li'

  initialize: ->
    _.bindAll @

    @template = template

    @render()

  render: ->
    @$el.html @template @model.toJSON()
