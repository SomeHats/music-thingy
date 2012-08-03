OptionsView = require 'views/options'
LoaderView = require 'views/loader'
Loader = require 'models/loader'
Search = require 'views/search'

module.exports = class Application extends Backbone.View
  tagName: 'div'

  initialize: ->
    Backbone.sync = (method, model, success, error) ->
      success()

    @loader = new Loader show:false
    loader_view = new LoaderView
      el: $('#loader')
      model: @loader

    options = new OptionsView el: $('.options')

    @speed = options.addOption
      label: 'Speed'
      options: [[4, 'slow'], [2, 'normal'], [1, 'fast']]
      active: 1

    $('#search').html 'hello'

    @search = new Search el: $('#search')
