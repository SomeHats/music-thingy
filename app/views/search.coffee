Results = require 'collections/results'
Result = require 'models/result'
ResultView = require 'views/result'
template = require 'views/templates/search'

module.exports = class Search extends Backbone.View
  tagName: 'div'
  id: 'search'

  initialize: ->
    _.bindAll @

    @template = template

    @render()

  render: ->
    @$el.html @template

    @$input = @$el.find 'input'
    @input = @$input[0]

    @$input.attr 'placeholder', @randomPlaceholder()
    @input.focus()

    @$input.on 'change keyup focus blur', @inputChange

  inputChange: (e) ->
    str = @input.value
    str = str.trim() if str.trim
    if str.length > 0
      @$el.addClass 'valid'
    else
      @$el.removeClass 'valid'

  randomPlaceholder: ->
    @placeholders[Math.floor Math.random() * @placeholders.length]

  placeholders: ['The Antlers','Black Kids','Blood Red Shoes','Bright Eyes','Darwin Deez','Delphic','Dutch Uncles','Empire of the Sun','Everything Everything','Fenech Soler','Foals','Friendly Fires','J\u00F3nsi','Justice','La Roux','Miike Snow','The Naked and Famous','Passion Pit','Phoenix','Sigur R\u00F3s','Surfer Blood','Tokyo Police Club','Two Door Cinema Club']
