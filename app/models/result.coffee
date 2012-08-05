module.exports = class Result extends Backbone.Model
  tagName: 'li'

  initialize: ->
    _.bindAll @

    raw = @get 'raw'
    @set
      title: raw.title.$t
      author: raw.author[0].name.$t
      id: raw.id.$t.split(':')[3]
      thumb: raw.thumb

    @unset 'raw'

