module.exports = class Option extends Backbone.Model
  defaults:
    label: 'button'
    options: [[1, 'One'], [2, 'Two'], [3, 'Three']]
    active: 0

  update: ->
    @value = @get('options')[@get('active')][0]

  initialize: ->
    @update()

    @on 'change', @update
