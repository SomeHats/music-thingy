Options = require 'collections/options'
Option = require 'models/option'
OptionView = require 'views/option'

module.exports = class OpionsView extends Backbone.View
  tagName: 'div'
  className: 'options'

  initialize: ->
    _.bindAll @

    @collection = new Options
    @collection.on 'add', @appendOption

    @render()

  render: ->
    # Currently, do nothing
    
  addOption: (options) ->
    option = new Option(options)
    @collection.add option
    option

  appendOption: (option) ->
    option_view = new OptionView
      model: option

    @$el.append option_view.render().el
