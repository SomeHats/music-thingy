class App extends Backbone.View
  error: (error) ->
    # A temporary solution
    alert "Error: #{error}"

module.exports = new App
