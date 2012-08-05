Application = require 'application'

$(document).on 'ready', ->
  App = new Application
  $('#cont').attr 'id', 'container'
  $('#container').append App.el
  window.App = App
