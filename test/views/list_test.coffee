ListView = require 'views/list'

describe 'ListView [view]', ->
  beforeEach ->
    @view = new ListView

  afterEach ->
    @view.remove()

  it 'should auto-render', ->
    expect(@view.$el.find 'button').to.have.length 1
    expect(@view.$el.find 'ul').to.have.length 1

  it 'should addItem on click', ->
    countBefore = @view.counter
    @view.$el.find('button').trigger('click').trigger 'click'
    expect(@view.counter).to.equal countBefore + 2
    expect(@view.$el.find 'li').to.have.length 2
