Application = require 'application'

$(document).on 'ready', ->
  app = new Application
  $('#cont').attr 'id', 'container'
  $('#container').append app.el
