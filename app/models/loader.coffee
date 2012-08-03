class Progress extends Backbone.Model
  defaults:
    show: false
    meter: 0.5

module.exports = class Loader extends Backbone.Model
  defaults:
    show: true
    progress: new Progress

  show: (loader = false) ->
    @set 'show', true
    @get('progress').set 'show', loader

  hide: ->
    @set 'show', false
    @get('progress').set 'show', false

  progress: (x) ->
    @get('progress').set 'meter', x


