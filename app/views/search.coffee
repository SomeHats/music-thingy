App = require 'app'
Results = require 'collections/results'
Result = require 'models/result'
ResultView = require 'views/result'
template = require 'views/templates/search'

module.exports = class SearchView extends Backbone.View
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

    @termChange()

    console.log @
    
    @model.on 'change:results', @renderResults
    @model.on 'change:term', @termChange

    @

  events:
    'change input': 'changeInput'
    'keyup input': 'changeInput'
    'click .cancel': 'clickCancel'
    'click .go': 'clickGo'

  changeInput: (e) ->
    @model.set
      term: @input.value,
        silent: true
    @model.trigger 'change:term'
    if @model.isValid() && e && e.which && e.which == 13
      @model.go()

   lockInput: (lock) ->
    if lock
      @$input.attr 'readonly', 'readonly'
      @input.blur()
      @$input.on 'focus', -> @input.focus()
    else
      @$input.removeAttr 'readonly'
      @$input.off 'focus'


  clickCancel: (e) ->
    @model.cancel()

  clickGo: (e) ->
    @model.go()

  renderResults: ->
    if @model.get 'results'
      @$el.addClass 'results'
      @lockInput true
      App.loader.show(false)
    else
      @$el.removeClass 'results'
      @lockInput false

  termChange: ->
    @input.value = @model.get 'term'
    if @model.isValid()
      @$el.addClass 'valid'
    else
      @$el.removeClass 'valid'

  randomPlaceholder: ->
    @placeholders[Math.floor Math.random() * @placeholders.length]

  placeholders: ['The Antlers','Black Kids','Blood Red Shoes','Bright Eyes','Darwin Deez','Delphic','Dutch Uncles','Empire of the Sun','Everything Everything','Fenech Soler','Foals','Friendly Fires','J\u00F3nsi','Justice','La Roux','Miike Snow','The Naked and Famous','Passion Pit','Phoenix','Sigur R\u00F3s','Surfer Blood','Tokyo Police Club','Two Door Cinema Club']
