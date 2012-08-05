module.exports = class Search extends Backbone.Model
  defaults:
    term: ''
    results: false

  validate: (attrs) ->
    if attrs.term.trim then str = attrs.term.trim() else str = attrs.term
    if str.length > 0
      return
    else
      'error'

  cancel: ->
    # Set sliently to avoid validation
    @set
      results: false
      term: '',
        silent: true
    
    # Trigger events to update the view
    @trigger 'change:term'
    @trigger 'change:results'

  go: ->
    if @isValid()
      @set
        results: true
