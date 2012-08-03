OptionsView = require 'views/options'

module.exports = class Application extends Backbone.View
  tagName: 'div'

  initialize: ->
    Backbone.sync = (method, model, success, error) ->
      success()

    options = new OptionsView el: $('.options')

    speed = options.addOption
      label: 'Speed'
      options: [[4, 'slow'], [2, 'normal'], [1, 'fast']]
      active: 1

    $(document).on 'click', -> console.log speed.value
