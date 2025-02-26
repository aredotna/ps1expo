Controller = require 'controllers/base/controller'
Channel = require 'models/channel'
Chaplin = require 'chaplin'
PlayerView = require 'views/player-view'

module.exports = class HomeController extends Controller
  index: ->
    @model = new Channel
      id: Chaplin.mediator.mainSlug

    @model.fetch
      success: =>
        @model.afterSuccess()
        @view = new PlayerView collection: @model.get('contents')

  show: (params)->
    @model = new Channel
      id: params.id

    @model.fetch
      success: =>
        @model.afterSuccess()
        @view = new PlayerView collection: @model.get('contents')

