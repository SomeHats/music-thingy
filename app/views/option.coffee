template = require 'views/templates/option'

module.exports = class OptionView extends Backbone.View
  tagName: 'span'
  className: 'option'

  initialize: ->
    _.bindAll @

    @model.on 'change', @render
    @model.on 'remove', @remove

    @template = template

  render: ->
    context =
      label: @model.get 'label'
      active: @model.get('options')[@model.get('active')][1]

    @$el.html @template(context)

    @

  events:
    "click": "update"

  update: ->
    options = @model.get 'options'
    active = @model.get 'active'
    active += 1
    if options.length <= active then active = 0
    @model.set 'active', active
