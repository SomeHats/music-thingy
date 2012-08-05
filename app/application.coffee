App = require 'app'
OptionsView = require 'views/options'
LoaderView = require 'views/loader'
Loader = require 'models/loader'
Search= require 'models/search'
SearchView = require 'views/search'
module.exports = class Application extends Backbone.View
  tagName: 'div'

  initialize: ->
    Backbone.sync = (method, model, success, error) ->
      success()

    App.loader = new Loader show:false
    loader_view = new LoaderView
      el: $('#loader')
      model: App.loader

    options = new OptionsView el: $('.options')

    App.speed = options.addOption
      label: 'Speed'
      options: [[4, 'slow'], [2, 'normal'], [1, 'fast']]
      active: 1

    App.search = new Search
    search_view = new SearchView
      el: $('#search')
      model: App.search

    # Automate:
    App.search.set 'term', 'Coldplay'
    App.search.go()
