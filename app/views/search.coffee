Results = require 'collections/results'
Result = require 'models/result'
ResultView = require 'views/result'
template = require 'views/templates/search'

module.exports = class Search extends Backbone.View
  tagName: 'div'
  id: 'search'

  initialize: ->
    _.bindAll @

    @template = template

    @render()

  render: ->
    @$el.html @template
