Application = require 'application'

$(document).on 'ready', ->
  App = new Application
  $('#container').append App.el
  window.App = App
