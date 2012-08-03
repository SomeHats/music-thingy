Item = require 'models/item'

describe 'Item [model]', ->
  beforeEach ->
    @model = new Item()

  afterEach ->
    @model.destroy()

  it 'should have 2 attributes', ->
    expect(Object.keys @model.attributes).to.have.length 2
