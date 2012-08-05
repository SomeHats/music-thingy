App = require 'app'
module.exports = class Router extends Backbone.Router
  routes:
    "": "reset"
    ":search": "search"

  search: (term) ->
    App.search.set 'term', decodeURIComponent term
    App.search.go()

  reset: ->
    if App.search.get 'results'
      App.search.cancel()
